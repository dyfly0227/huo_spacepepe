import io from "socket.io-client";
import { env } from "../../core/service/envconfig";
var token = localStorage.getItem('socket_token')
var userid = '';
if(token)
{
  let tokensplit = token.split("_");
  userid = tokensplit[0];
}else{
  userid = Math.random() * 10+new Date
}
export const socket = io(env.apiHost,{
  query: { user_id: userid },
  reconnection: true,
});