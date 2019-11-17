// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
 Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
 */

package main

/* Imports  
* 4 utility libraries for handling bytes, reading and writing JSON, 
formatting, and string manipulation  
e 2 specific Hyperledger Fabric specific libraries for Smart Contracts  
*/ 
import (
	"bytes"
	"encoding/json"
        "strconv"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define Firearm structure
Structure tags are used by encoding/json library
*/
type Firearm  struct {  /* TODO:  Add ENUMERATIONS OR VALIDATIONS?? */
	Manufacturer string `json:"manufacturer"`
	Importer string `json:"importer"`
	Model string `json:"model"`
	SerialNumber string `json:"serialNumber"`
	Type string `json:"type"`  
	Action string `json:"action"`
	Caliber string `json:"caliber"`
	Gague string `json:"gague"`
	DateAcquired string `json:"dateAcquired"`
	PurchaseLocation string `json:"purchaseLocation"`
	Holder  string `json:"holder"`
}

type AccessTracker  struct {  /* TODO:  Add ENUMERATIONS OR VALIDATIONS?? */
	AccessorID string `json:"accessorid"`  /* ID Of the person who accessed the counter */
	AccessDate string `json:"accessDate"`  /* ID Of the person who accessed the counter */
	AccessCounter string `json:"AccessCounter"`
}


/*
 * The Init method *
 called when the Smart Contract "sc-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function 
 -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {

        accesstracker := AccessTracker{AccessorID: "initJen", AccessDate:  "2019", AccessCounter: "0" }
	trackerAsBytes, _ := json.Marshal(accesstracker)
        APIstub.PutState(strconv.Itoa(0),trackerAsBytes)
	fmt.Println("Added", accesstracker) 

	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "sc-chaincode"
 The app also specifies the specific smart contract function to call with args
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryFirearm" {
		return s.queryFirearm(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordFirearm" {
		return s.recordFirearm(APIstub, args)
	} else if function == "queryFirearmHistory" {
		return s.queryFirearmHistory(APIstub, args)
	} else if function == "queryAllFirearms" {
		return s.queryAllFirearms(APIstub)
	} else if function == "changeFirearmHolder" {
		return s.changeFirearmHolder(APIstub, args)
	} else if function == "queryFirearmByHolder" {
                return s.queryFirearmByHolder(APIstub, args)
        }

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryFirearm method *
Used to view the records of one particular firearm
It takes one argument -- the key for the firearm in question
 */
func (s *SmartContract) queryFirearm(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	firearmAsBytes, _ := APIstub.GetState(args[0])
	if firearmAsBytes == nil {
		return shim.Error("Could not locate firearm")
	}
	return shim.Success(firearmAsBytes)
}

/*
 * The initLedger method *
 */


func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {

        /* i := 0
        accesstracker := AccessTracker{AccessorID: "initJen", AccessDate:  "2019", AccessCounter: "0" }
	trackerAsBytes, _ := json.Marshal(accesstracker)
        APIstub.PutState(strconv.Itoa(0),trackerAsBytes)
	fmt.Println("Added", accesstracker)  
*/


  firearm := []Firearm{
		Firearm{Manufacturer: "ColtNEW", Model: "Commander 194", SerialNumber: "CJ42139", Action: "Semi", Caliber: ".45", DateAcquired: "2012", Holder:"Jen"},
		Firearm{Manufacturer: "Kimber", Model: "Dessert Warrior", SerialNumber: "K425498", Action: "Semi", Caliber: ".45", DateAcquired: "2015", Holder:"Mariam"},
		Firearm{Manufacturer: "Savage", Model: "Rascal", SerialNumber: "CJ42139", Action: "Bolt", Caliber: ".22", DateAcquired: "2013", Holder:"Ryan"},
		Firearm{Manufacturer: "Remington", Model: "1100 Special", SerialNumber: "P156664V", Action: "Semi", Gague: "12gague", DateAcquired: "2010", Holder:"Remington CO"},
		Firearm{Manufacturer: "Remington", Model: "1100 Special", SerialNumber: "P156665V", Action: "Semi", Gague: "12gague", DateAcquired: "2010", Holder:"Goods for the Woods, LLC"},
	}

	j := 0
	for j < len(firearm) {
		fmt.Println("j is ", j)
		firearmAsBytes, _ := json.Marshal(firearm[j])
		APIstub.PutState(strconv.Itoa(j+1), firearmAsBytes)
		fmt.Println("Added", firearm[j])
		j = j + 1
	}

	return shim.Success(nil)
}



func (s *SmartContract) recordFirearm(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 12 {
		return shim.Error("Incorrect number of arguments. Expecting 12 ")
	}

	var firearm = Firearm{ Manufacturer: args[1], Importer: args[2], Model: args[3], SerialNumber: args[4], Type: args[5], Action: args[6], Caliber: args[7], Gague: args[8],
                         DateAcquired: args[9], PurchaseLocation: args[10], Holder: args[11] } 

	firearmAsBytes, _ := json.Marshal(firearm)
	err := APIstub.PutState(args[0], firearmAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record firearm : %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllFirearms method *
allows for assessing all the records added to the ledger(all firearm)
This method does not take any arguments. Returns JSON string containing results. 
 */
func (s *SmartContract) queryAllFirearms(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllFirearms:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The queryFirearmHistory method *
allows for assessing all the records added to the ledger for a given firearm
This method takes one. Returns JSON string containing results. 
 */
func (s *SmartContract) queryFirearmHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	resultsIterator, err := APIstub.GetHistoryForKey(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(args[0])
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryFirearmHistory:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/* The queryFirearmByHolder method *
allows for assessing all the records added to the ledger for a given firearm
This method takes one. Returns JSON string containing results. 
 */
func (s *SmartContract) queryFirearmByHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

       //TODO:  make real query string once this is all wired up.  See example for now just using same as the history for key
       //https://github.com/hyperledger/fabric-sdk-rest/blob/master/tests/input/src/marbles02/marbles_chaincode.go

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

       holder := args[0];;

        //queryString := "{\"selector\":{\"holder\":\"jen\"}}"
        queryString := fmt.Sprintf("{\"selector\":{\"holder\":\"%s\"}}",holder)
         //{"selector":{"holder":"jen"}}

	resultsIterator, err := APIstub.GetQueryResult(queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(args[0])
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryFirearmHistory:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeFirearm method *
The data in the world state can be updated with who has possession. 
This function takes in 2 arguments, firearm id and new holder name. 
 */
func (s *SmartContract) changeFirearmHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	firearmAsBytes, _ := APIstub.GetState(args[0])
	if firearmAsBytes == nil {
		return shim.Error("Could not locate firearm")
	}
	firearm := Firearm{}

	json.Unmarshal(firearmAsBytes, &firearm)
	// Normally check that the specified argument is a valid holder of firearm
	// we are skipping this check for this example
	firearm.Holder = args[1]

	firearmAsBytes, _ = json.Marshal(firearm)
	err := APIstub.PutState(args[0], firearmAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change firearm holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * main function *
calls the Start function 
The main function starts the chaincode in the container during instantiation.
 */
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
