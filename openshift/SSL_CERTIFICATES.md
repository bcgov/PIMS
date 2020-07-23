# Instructions to Install SSL Certificates

## Step 1: Generate a new CSR file

A Certificate Signing Request (CSR) is needed for making requests for SSL certificates or certificate renewals.

Related info: https://pathfinder-faq-ocio-pathfinder-prod.pathfinder.gov.bc.ca/SSLCerts/GenerateCertificateSigningRequest.html

To generate a CSR, run the following commands on your local machine. The CSR and private key do **NOT** have to be created on the intended machine or container.

```bash
openssl req -new -newkey rsa:2048 -nodes -out pims.gov.bc.ca.csr \
  -keyout pims.gov.bc.ca.key \
  -subj "/C=CA/ST=British Columbia/L=Victoria/O=Government of the Province of British Columbia/OU=CITZ/CN=pims.gov.bc.ca"
```

**Windows workstations**

Windows `git bash` may have issues with the above command (e.g. backslash or forward slashes), so you may need to run the command as below, answering each prompt in turn (for example):

```bash
openssl req -new -newkey rsa:2048 -nodes -out pims.gov.bc.ca.csr -keyout pims.gov.bc.ca.key
```

Response should be:

```
Generating a RSA private key
.........+++++
...............................+++++
writing new private key to 'pims.gov.bc.ca.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CA
State or Province Name (full name) [Some-State]:British Columbia
Locality Name (eg, city) []:Victoria
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Government of the Province of British Columbia
Organizational Unit Name (eg, section) []:CITZ
Common Name (e.g. server FQDN or YOUR name) []:pims.gov.bc.ca
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

Keep the secret key and only send the `.csr` file to the DNS team. The DNS team will make an iStore request with the `.csr` file and will provide the SSL certificates when they are ready.

## Step 2: Install SSL certificates

As a best practice, you should store these files as an OpenShift Secret in that same project (e.g. the PROD project namespace). That way, the keys can be retrieved when needed instead of searching on a developer's machine. Only project Admins can view secret contents in OpenShift.

Ensure you have all four (4) required files on the current folder:

- Certificate: pims.gov.bc.ca.txt
- Private Key: pims.gov.bc.ca.key
- CA Certificate: L1KChain.txt
- CA Root Certificate: G2Root.txt

Then run the following `oc` command to create the secret:

```bash
oc -n jcxjin-prod create secret generic pims.gov.bc.ca-ssl.2020 \
 --from-file=private-key=pims.gov.bc.ca.key \
 --from-file=certificate=pims.gov.bc.ca.txt \
 --from-file=csr=pims.gov.bc.ca.csr \
 --from-file=ca-chain-certificate=L1KChain.txt \
 --from-file=ca-root-certificate=G2Root.txt
```

Please use the same key labels (e.g. `ca-chain-certificate`, `ca-root-certificate`, `certificate`, `csr`, `private-key`) so that there is consistency across projects.

## Step 3: Create secured route for your site

You can create secured routes using the web console or the CLI.

:bulb: **IMPORTANT** - PIMS relies on configuring individual OpenShift routes to the backend pod and the frontend pod. Due to the naming of the routes and how routing works in OpenShift, the **order of creation if important** - the more specific route for the backend `pims.gov.bc.ca/api` needs to be created before the broader frontend route `pims.gov.bc.ca/`. Failure to do so will result in the API returning network errors and the app failing to work consistently.

#### 3.1 Create API route first

Using the command line, the following example creates a secured HTTPS route named `pims-gov-bc-ca-api` that directs traffic to the `backend` service. Note that the route path is set to `/api`:

```bash
oc -n jcxjin-prod create route edge pims-gov-bc-ca-api \
 --service=pims-api-prod \
 --cert=pims.gov.bc.ca.txt \
 --key=pims.gov.bc.ca.key \
 --ca-cert=L1KChain.txt \
 --hostname=pims.gov.bc.ca \
 --path=/api \
 --insecure-policy=Redirect
```

**Windows workstations**

Windows `git bash` may have issues with the above command (e.g. forward slashes in `/api`), so you may need to run the command as below. Note that the path has a double slash to avoid expansion by `git bash`:

```bash
oc -n jcxjin-prod create route edge pims-gov-bc-ca-api \
 --service=pims-api-prod \
 --cert=pims.gov.bc.ca.txt \
 --key=pims.gov.bc.ca.key \
 --ca-cert=L1KChain.txt \
 --hostname=pims.gov.bc.ca \
 --path=//api \
 --insecure-policy=Redirect
```

#### 3.2 Create web route

Using the command line, the following example creates a secured HTTPS route named `pims-gov-bc-ca` that directs traffic to the `frontend` service:

```bash
oc -n jcxjin-prod create route edge pims-gov-bc-ca \
 --service=pims-app-prod \
 --cert=pims.gov.bc.ca.txt \
 --key=pims.gov.bc.ca.key \
 --ca-cert=L1KChain.txt \
 --hostname=pims.gov.bc.ca \
 --insecure-policy=Redirect
```

Using the web console, you can navigate to the **Routes** page, found under the **Applications** section of the navigation.
Click **Create Route** to define and create a route in your project.

Use the following settings:

- Name: pims-gov-bc-ca
- Hostname: pims.gov.bc.ca
- Path: `/`
- Service: pims-app-prod
- Secure Route: (yes)
- TLS Termination: Edge
- Insecure Traffic: Redirect

| Route field                | Created secret       | Source file        |
| -------------------------- | -------------------- | ------------------ |
| Certificate                | certificate          | pims.gov.bc.ca.txt |
| Private Key                | private-key          | pims.gov.bc.ca.key |
| CA Certificate             | ca-chain-certificate | L1KChain.txt       |
| Destination CA Certificate | _leave empty_        | _leave empty_      |

## Step 4: Verify new route

The site should work immediately after saving these OpenShift settings.

- Check that https://pims.gov.bc.ca is live and that the app loads correctly
- Verify SSO (Keycloak) settings - https://sso.pathfinder.gov.bc.ca/
