//if we want to access the session on client side then auth.js gives us a react hook named useSession() but technically if we think about it we cannot just directly access the session on client side (session means the data encrypted in the JWT token stored in the cookie) because it would become a security measure if we could directly access the cookie on the client side so by default auth.js makes this cookie http only and also same-site so that it cannot be accessed on client side. But it also gives us a way to access it on the client side which is that it tells us to create an api route api/auth/[...nextauth] with GET and POST handlers
/*NOTE: 
[...nextauth] this means catch all route anything that would come after api/auth/... it will catch it and go to this route
We get GET and POST handlers from the NextAuth itself
*/

export { GET, POST } from "@/lib/auth";
