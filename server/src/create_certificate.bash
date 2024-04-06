#!/bin/sh

# Create CA key and certificate
openssl genrsa -des3 -out serverCA.key 2048
openssl req -x509 -new -nodes -key serverCA.key -sha256 -days 1825 -out serverCA.pem

# Add root certificate to macOS keychain
sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" serverCA.pem

# Make sure common name is localhost
# Create private key for site
openssl genrsa -out chatApp.key 2048
openssl req -new -key chatApp.key -out chatApp.csr

# Creating certificate
openssl x509 -req -in chatApp.csr -CA serverCA.pem -CAkey serverCA.key \
-CAcreateserial -out chatApp.crt -days 825 -sha256 -extfile chatApp.exe
