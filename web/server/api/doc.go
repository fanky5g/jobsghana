package api

// TALENTSINAFRICA_LOCAL_DEV=true make serve
// sudo ssh -i talentsinafrica.pem ec2-user@ec2-52-89-50-132.us-west-2.compute.amazonaws.com
// docker-compose up -d --no-deps --build
// docker-compose -f docker-compose.production.yml up -d --no-deps --build web
// M3 General Purpose Medium	m3.medium	3.75 GiB	1 vCPUs	4 GiB SSD	Moderate	$48.910000 monthly
// T2 Medium	t2.medium	4.0 GiB	2 vCPUs for a 4h 48m burst	EBS only	Low to Moderate	$33.872000 monthly
// http -f POST https://127.0.0.1:3000/api/v1/resume/parse resume@~/Projects/ChineseResumeParser/ResumeTransducer/UnitTests/AntonyDeepakThomas.pdf --verify no
// psql -U postgres -d talentsinafrica -c "UPDATE \"users\" SET \"account_approved\" = false WHERE email = 'appiahbrobbeybenjamin@rocketmail.com'"
// UPDATE posts SET author=jsonb_set(author, '{avatar}', '"https://s3.amazonaws.com/talentsinafrica_store/images/gravatar.png"', true) where shorturl = 'top-5-skills-that-will-make-you-stand-out-in-the-workplace';
// 172.26.66.84  4145
// sudo /bin/bash ~/proxy_on.sh 192.168.49.1 8282

// docker volume rm $(docker volume ls --quiet --filter "dangling=true")
// docker rm $(docker ps --no-trunc --quiet --filter "status=exited")
// docker rmi $(docker images --no-trunc --quiet --filter "dangling=true")
