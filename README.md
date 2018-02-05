# SelfControlDemo
Demo App Copied from Hyperledger Demo for SelfControl

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
   * Install latest Docker impages for Hyperledger Fabric
        * Check for latest versions:  https://hyperledger-fabric.readthedocs.io/en/latest/samples.html#binaries
        * Get them:  curl -sSL https://goo.gl/Q3YRTi | bash
        * creates bin subdirectory in working directory has binaries for cryptogen, etc.
        * Confirm with 'docker images' command.
   * get your path set-up
        * export PATH=$PWD/bin:$PATH
        
  Clone the code from github
   * git clone https://github.com/jenmcgrath01/SelfControlDemo.git
   
   Do the npm install (will create node_modules directory)
   * cd sc-app
   * npm install
   
   Start the Fabric Clients
   * cd sc-app
   * ./startFabric.sh
   
   Register Users/StartServer:
   * node registerAdmin.js
   * node registerUser.js
   * node server.js
   
   Then you can go to https://localhost:8000 to interact with the app.
   
   Teardown scripts (stop.sh and teardown.sh) are in the basic-network folder.
   
   
