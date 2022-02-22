
export default function ajax(url,{method="GET",body=null,headers=null}={method:"GET",body:null,headers:null}){
            return new Promise(function(resolve,reject){
                var xhr=new XMLHttpRequest();
                xhr.open(method,url);
                if(headers) Object.keys(headers).forEach(key=>{
                    xhr.setRequestHeader(key,headers[key]);
                });
                if(typeof body==="object" && body!==null) body=JSON.stringify(body);
                xhr.send(body);
                xhr.onreadystatechange=function(e){
                    if(xhr.readyState===4 && xhr.status===200){
                        var body
                        try{
                            body=JSON.parse(xhr.response);
                        }catch(e){}
                        var headers=xhr.getAllResponseHeaders().match(/[^\r\n]+/g).reduce((v,t)=>{
                            var arr=t.split(/:\s/);
                            var d=arr[1];
                            try{
                                d=JSON.parse(d);
                            }catch(e){}
                            v[arr[0]]=d;
                            return v;
                        },{})
                        resolve({body,headers,status:xhr.status,readyState:xhr.readyState});
                    }else if(xhr.readyState===4){
                        reject(xhr.status);
                    }
                }
                xhr.onerror=function(e){
                    reject(e)
                }
            })
        }

