# belong_problem
A simple message queue using node-redis

#mymq

Express service accepts two endpoints

1. http://localhost:3000/add (POST)
		body : {
			x : <Number>,
			y: <Number>
		}
	returns a job id

2. http://localhost:3000/job/:jobid (GET)

	returns number representing the sum of 2 numbers


#dealer

Node.js application which creates workers and uses them to perform computation


#How to Run

1. Clone the repo
2. cd mymq/ -> npm install
3. npm install redis
4. Run a redis server locally on default host and port
5. Hit the endpoints described above
