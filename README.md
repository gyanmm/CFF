# Chinmaya Forms Framework
Chinmaya Forms Framework (CFF) is a system that allows for management of forms, accounts, and payment integration.

- Manage forms
- Create forms using (JSON Schema](https://json-schema.org/)
- Export responses
- Associate accounts with responses
- Integrate with PayPal and CCAvenue

CFF has been used for events such as:

- Walkathons
- Balavihar Registration
- Camp Registration
- Information Collection Forms
- Donation Forms

Read more at the documentation: http://docs.chinmayamission.com/cff/

## Run frontend locally
```npm i
 npm start
```

## Run backend tests locally
```
cd lambda
pipenv install
npm test
```

## Deploy to beta
Beta environment: https://forms.beta.chinmayamission.com
```
npm run deploy
sls deploy --stage beta
cd lambda
npm run deploy-prod
```

## Deploy to prod
Prod environment: https://forms.chinmayamission.com
```
npm run deploy-prod
sls deploy --stage prod
cd lambda
npm run deploy-prod
```
