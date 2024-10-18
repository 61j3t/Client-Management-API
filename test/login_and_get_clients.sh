#!/bin/bash

# Log in and store cookies
curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=c1jet&password=c1jet123" \
     -c cookies.txt

# Get clients using stored cookies
curl -X GET http://localhost:3000/clients \
     -b cookies.txt
