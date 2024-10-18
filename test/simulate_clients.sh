#!/bin/bash

# Number of clients to simulate
NUM_CLIENTS=5

# Loop to open multiple terminal windows
for ((i=1; i<=NUM_CLIENTS; i++))
do
    # Open a new terminal window and run the curl command with a unique client_id
    osascript -e "tell application \"Terminal\" to do script \"curl -O http://localhost:3000/download?client_id=client$i\""
done
