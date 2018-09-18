module.exports=function (response,parsedlist,pageNum,query){
response.write('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style> .container{position:relative;max-width:600px;height:400px; border:solid 10px;border-radius:10px;-webkit-overflow-scrolling:touch; overflow-y:scroll;} .interface{position:absolute;bottom:0px;width:100%;height:30px;background-color:LightGray;z-index:3;opacity:0.3;overflow:hidden;} .searchbar{display:inline-block;width:50%;height:50px;top:10px;background-color:AliceBlue;} .interface.Large{opacity:1;height:200px;} iframe{position:relative;width:100%;height:100%;border:solid:30px;} </style> </head><body><div> Search<form action="/query"><input  class="searchbar" type=text name:"query" value="'+query+'"></form></div><div id=c>');

for(var i=0;i<25;i++) {
response.write('<div class="container"><div class="interface"> <span class="interface--from"> From: '+ parsedlist[i+pageNum*25].from.html+'</span><span class="interface--Date">'+ parsedlist[i+pageNum*25].date.toUTCString()+'   </span> <span class="interface--subject">'+ parsedlist[i+pageNum*25].subject +'            </span> </div><iframe sandbox src="/'+(i+pageNum*25)+'"> </iframe></div>');

};



response.write('</div><form action="/next" method="get"><button id="more" type="submit"> More </button></form><form action="/" method="post"><input name="to" /><textarea name="emailtext" rows="10" cols="50"></textarea><button type="submit">Send </button></form> <script type="text/javascript">var count=26; var c=document.getElementById("c");var open=function(e){event.target.classList.toggle("Large");event.target.parentElement.classList.toggle("Large");}; c.addEventListener("click",open);</script>');
}
