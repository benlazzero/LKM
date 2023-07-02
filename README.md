# LKM
Linkedin package manager

Package manager that used linkedin's pdf post upload as a database. Zip package -> encode to pdf -> upload.
Then used twitter as a registry. Post on X account would include package name/url to linkedins CDN where it is stored. 
When installing packages the cl tool scrapes the "registry(twitter account)" if url is not specified. if package is found it will parse
out the url and then download->decode->unzip in node_modules->create lkmconfig.json 

Worked for about a week but yeah linkedin flagged encoded packages as "viruses" pretty quick, then the twitter registry account got banned. 
