
## Aws CLI Commands

- Add a aws profile
    - `aws configure --profile produser`
- List security groups
    - `aws ec2 describe-security-groups`
- List security group by name
    - `aws ec2 describe-security-groups --group-name love-main-security-group`
- Authorize Current IP for RDS security group
    - First create security group and assign to RDS
    - Get own ip
        - `https://www.google.com/search?q=what+is+my+ip`
    - Add to CIDR ingress (using port for postgres)
        - `aws ec2 authorize-security-group-ingress --group-name love-main-security-group --protocol tcp --port 5432 --cidr 174.__.__.14/32`
    - Target Json:

```
{                                                            
    "SecurityGroups": [                                      
        {                                                    
            "Description": "Access to known IPs",            
            "GroupName": "love-main-security-group",         
            "IpPermissions": [                               
                {                                            
                    "IpProtocol": "-1",                      
                    "IpRanges": [                            
                        {                                    
                            "CidrIp": "174.__.__.14/32"      
                        }                                    
                    ],                                       
                    "Ipv6Ranges": [],                        
                    "PrefixListIds": [],                     
                    "UserIdGroupPairs": []                   
                }                                            
            ],                                               
            "OwnerId": "47...",                       
            "GroupId": "sg-03...",               
            "IpPermissionsEgress": [                         
                {                                            
                    "IpProtocol": "-1",                      
                    "IpRanges": [                            
                        {                                    
                            "CidrIp": "0.0.0.0/0"            
                        }                                    
                    ],                                       
                    "Ipv6Ranges": [],                        
                    "PrefixListIds": [],                     
                    "UserIdGroupPairs": []                   
                }                                            
            ],                                               
            "VpcId": "vpc-0efba574"                          
        }                                                    
    ]                                                        
}                                                            
```

- Revoke Current IP Access
    - Add to CIDR ingress (using port for postgres)
        - `aws ec2 revoke-security-group-ingress --group-name love-main-security-group --protocol tcp --port 5432 --cidr 174.__.__.14/32`

- List Lambda Functions
    - `aws lambda list-functions`

### Read Logs

From: https://stackoverflow.com/a/49795122/567524

- List log group names
    - `aws logs describe-log-groups --query logGroups[*].logGroupName`
- List log streams for a log group
    - `aws logs describe-log-streams --log-group-name "/aws/lambda/MyFunction" --query logStreams[*]`
- View Log
    - `aws logs get-log-events --log-group-name '/aws/lambda/MyFunction' --log-stream-name '2018/02/07/[$LATEST]140c61ffd59442b7b8405dc91d708fdc'`


### Create Public Read-Only Bucket

- Create `test-uploads` bucket
    - `aws s3api create-bucket --bucket test-uploads --create-bucket-configuration LocationConstraint=us-east-1`
        - Note: Change name and region
- Set Cors:
    - `aws s3api put-bucket-cors --bucket gator-texting-uploads --cors-configuration file://bucket-cors.json`
    - `./bucket-cors.json`

```
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "*"
      ],
      "AllowedMethods": [
        "GET",
        "PUT",
        "POST"
      ],
      "MaxAgeSeconds": 3000,
      "AllowedHeaders": [
        "*"
      ]
    }
  ]
}
```

- Set Policy
    - `aws s3api put-bucket-policy --bucket gator-texting-uploads --policy file://bucket-policy.json`
    - `./bucket-policy.json`

```
{
    "Version": "2008-10-17",
    "Id": "Public Readonly Bucket Policy",
    "Statement": [
        {
            "Sid": "readonly policy",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::test-uploads/*"
        }
    ]
}
```

