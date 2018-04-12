# SelfControlDemo
Demo App Based on from Hyperledger Demo for SelfControl

Environment Set-up and Necessary Tools:  
In order to Run this Sample app,  must have this env set-up done.  Instruction for Mac.  Can translate for windows/linux.
  * cURL (on a Mac should be by default, check from command line with curl -v)
  * Docker/Docker Compose
      *https://www.docker.com/docker-mac
      * docker --version && docker-compose --version
      * should have version 1.9.0 or higher.
  * node.js and npm (go to https://nodejs.org/en/download/ ; verify with node --version && npm --version) 
  * Go Language installed (verify with "which go")
        https://golang.org/dl/ 
        * cd ~
        * sudo curl -O https://storage.googleapis.com/golang/go1.9.2.darwin-amd64.pkg
        * open open go1.9.2.darwin-amd64.pkg
        * echo $GOPATH and/or export GOPATH=$HOME/go (set in .profile if you want)
        * go version (shoudl be >=1.8)
   * get your path set-up
        * export PATH=$PWD/bin:$PATH
        
  Clone the code from github:
  
   * git clone https://github.com/jenmcgrath01/SelfControlDemo.git
   
   Install latest Docker images for Hyperledger Fabric:
   
   
        * Check for latest versions:  https://hyperledger-fabric.readthedocs.io/en/latest/samples.html#binaries
        * cd SelfControlDemo
        * Get them:  curl -sSL https://goo.gl/Q3YRTi | bash
        * creates bin subdirectory in working directory has binaries for cryptogen, etc.
        * Confirm with 'docker images' command.
        
   Do the npm install (will create node_modules directory):
   * cd SelfControlDemo
   * cd sc-app
   * npm install
   
   Verify that you've got what you need:
   * Scripts in SelfControlDemo/basic-network and sc-app should have execute permission (chmod +x *.sh)
   * SelfControlDemo should have 4 subdirectories (bin, sc-app, basic-network, chaincode)
     ** NOTE: bin comes from hyperledger and stores fabric binaries
   * Should have a node_modules subdirectory in the sc-app directory
   * Should have .env file in the basic-network directory (ls -la)
   
   Start the Fabric Clients
    * ./startFabric.sh  (try this a couple times, the timing of the sleeps may be off)
   
   Then register Users/StartServer:
   * node registerAdmin.js
   * node registerUser.js
   * node server.js
   
Go to https://localhost:8000 on localbrowser to interact with the app.
   
Teardown scripts (stop.sh and teardown.sh) are in the basic-network folder.
   
   
