
## Specifying AWS Profile for deploy

- In serverless.yml

```  
provider:
  name: aws
  runtime: nodejs12.x
  profile: profile-name
  region: us-west-2
  stage: prod
```

- Then run deploy to use the AWS profile, region, and stage
    - `serverless deploy`

- It can be handy to check deployment with aws cli:
    - `set AWS_DEFAULT_PROFILE=profile-name`
    - `aws lambda list-functions`


## Remove a deploy (for example if forgot to set region)

- `serverless remove --region us-east-1`
- `serverless remove --stage dev --region us-east-1`
- Confirm with AWS ClI
    - `aws lambda list-functions --region us-east-1`