# E-Commerce App For Event Tickets

Made Using NodeJS Microservices & NextJS

To run the app, make sure you have Kubernetes & Skaffold installed then run the `skaffold dev` command
in th root of the repo.

To deploy the Kubernetes cluster, you have to create a jwt Secret in Kubernetes using the following command,
replacing YOUR_SECRET with your desired jwt secret:

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=YOUR_SECRET`