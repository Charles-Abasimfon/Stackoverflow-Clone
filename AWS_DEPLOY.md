# HOW TO DEPLOY ON AWS

### 1. Create appropriate AWS roles
AWS CodeDeploy and the EC2 instance would need permission to access the build artifacts from S3 storage.
- Go to Roles inside the IAM dashboard on the AWS console.
- Click Create Role button. 
- Select “AWS Service” as the entity type and “EC2” option in common use cases. In the Permissions policy, search for “s3readonly”, select “AmazonS3ReadOnlyAccess” from the entry, and click the next button.
- Give any name (like “EC2S3ReadPermission”) for this role in the text box and click create role button at the bottom of the screen.
- Go back to the create role page and select “AWS service” like before, scroll down to the bottom of the page, and select “CodeDeploy” from the dropdown field in the use cases for other AWS services.
After selecting this option, select the first radio option with the text “CodeDeploy”
- The “AWSCodeDeploy” policy should be attached. Click next and on the final page give a name (like CodeDeployPermissionRole) and click “Create role”.

### 2. Launch the EC2 instance
Setup AWS EC2.
N/B: In Advanced Details: In the “IAM instance profile” field, open the dropdown and select the role created for the EC2 instance (EC2S3ReadPermission).
 Once the instance is created and ready, ssh into it:
`ssh -i <login-key-file> ec2-user@<public-ip-of-ec2-instance>`

### 3. Configuration & Installation
- Run `sudo yum update -y`
- Add user (Replace charles with appropriate username and password):
`sudo su`
`useradd charles`
`passwd charles`
- Make this user a sudoer (Not best practice for production environment):
`echo "charles ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers`
- Switch to this user and install Docker
`su - charles`
`sudo yum install docker -y`
- Start the service
`sudo service docker start`
- Switch to root user and add the user to the docker group
`sudo su`
`usermod -aG docker charles`
- Switch back to normal user
`su — charles`
- Check docker installation
`docker ps`
- Install docker compose
`sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
`sudo chmod +x /usr/local/bin/docker-compose`
- Check docker compose installation
`docker-compose --version`
- Setup code deploy agent
`sudo yum install ruby`
`sudo yum install wget`
`wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install`
`chmod +x ./install`
`sudo ./install auto`
- Check service status
`sudo service codedeploy-agent status`
- In the AWS console, create a bucket. Enable Bucket versioning and click the “Create bucket” button. Verify bucket creation by going back into the console connected to EC2 via SSH and run `aws s3 ls`.

### 4. AWS Tools Setup
- Go to the CodeBuild page on AWS Console.
- Click the “Create build project” button.
- Name it example: “StackOverflowBuild”
- Scroll down and in the Source section, select “GitHub” as the source provider and select the “Repository in my GitHub account” option in the Repository field. 
- Click Connect to GitHub. 
- In the pop-up window, provide your GitHub credentials and provide confirmation of access.

- Enter the URL of your repo. 
- Enter “main” as the source version. 
- Scroll down to the Environment section and select “Amazon Linux 2” as the operating system. 
- Select “Standard” as runtime.
- Select “aws/codebuild/amazonlinux2-arch-x86_64-standard:4.0”. 
- Select “Linux” as the environment type.
- For the “Service role” field, select the “New service role” option.
- In the Role ARN field, select a new service role and give a name.

- Scroll to the Buildspec section, and make sure the “use a buildspec file” option is selected.
- Since I have named the file as “buildspec.yml” in source code we can leave the Buildspec name field blank.

- Scroll down to the Artifacts section, and select the Amazon S3 option in the type field.
- Enter the bucket name that was created earlier on.
- Select the “Zip” option for the Artifacts packaging field.
- Check the CloudWatch logs as it will help in reading logs in case something fails in the pipeline. Give any group name and stream name.

- Click the “Create build project” button.

- Give this role S3 permission by going to the Role section on the IAM page. Click on the new role name. Then click “Add Permissions” to open the dropdown and then click “Attach policies”. In the new window, by “s3fullaccess”. Check “AmazonS3FullAccess” and click the “Add permissions” button. 
- Once this permission is added, come back to the CodeBuild page.

- Click the “Start build” button. This will create a build and also upload it to S3 bucket.

- Verify that all artifacts are present in the bucket by going into the S3 bucket page and clicking the Download button.

- In AWS console in the browser, search for CodeDeploy in the search bar and open the AWS CodeDeploy page. Click Application from the left menu.
- Click Create Application button.
- Give it a name and for the Compute platform, select the “EC2/On-premises” option.
- Click on the Create button.
- Once created, click the “Create deployment group” button.
- On its creation page, enter a deployment group name.
- In the Service role section, type the role name that we created earlier for CodeDeploy and select the option accordingly.
- In the environment configuration, tick the “Amazon EC2 instances” and in the tags field, enter “Name” as the key and value as the name given to the EC2 instance at the beginning.
- You should see "1 unique matched instance'
- Scroll down and uncheck Load Balancer, Will be created manually. 
- Click Create button.
- Once the Deployment group is created, click the “Create deployment” button.
- In this screen, ensure that for the Revision type field “My application is stored in Amazon S3” is selected.
- Copy the S3 URI from the S3 bucket page and paste it into the “Revision location” field.
- Then select “zip” as an option for the Revision file type field.
- Click create deployment button.
- Once the deployment is created, you should see all the artifacts in the “/home/charles/devopspipeline” directory.

- Now run, `docker ps` and you should see the containers running.

- If you copy the EC2 instance public IP and paste it into the browser, you should see the app running.

### 5. AWS CodePipeline
- In the AWS console in the browser, search for CodePipeline.
- On the Codepipeline page, click the “Create pipeline” button.
- Give a name.
- Select “New service role” in the Service role field.
- Expand the “Advanced Settings” section and select the “Custom location” option and enter the bucket name in the Bucket field, click the next button. In the next screen, for the Source provider field, select GitHub Version 1 option, If you are using password-based authentication. However, It is recommend by AWS to use GitHub version 2.
- Click the “Connect to GitHub” button.
- In a new pop-up window, click confirm button and you should see that the pop window gets closed and a success message.
Enter the repository name and main as the branch. Select “GitHub webhooks” as the Change detection option and click next.
- On the next page, select AWS CodeBuild as the Build provider. 
- Enter Project name and click next.
- On the next page, select AWS CodeDeploy as the Deploy provider. 
- Fill in Application name field.
- Fill in Deployment group field and click next.
- Click create pipeline button.

- Once the pipeline is created, you should the three stages, where the first stage is the source from GitHub, the second stage is to build from CodeBuild, and deploy using CodeDeploy.

- So every time a push is made with any changes to the repository, the pipeline will trigger and stages will run. Also every time new changes are incorporated, artifacts will be generated with the same name. Hence the need for versioning in the S3 bucket, otherwise the build will fail.

- Go into the container running Mongo: 
`docker exec -it <container-id-of-mongo> bash`
- Type `mongosh` and its shell should open.
- To show all databases, run `show dbs` and you should see the database.
- To switch to the database: `use stackoverflow-clone`
- Show all users: `db.users.find().pretty()`
- If you have registered in the application, you should see the user entry here.
- Type `exit` again to come out of the container.