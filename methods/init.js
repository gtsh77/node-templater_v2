	init: function(){
		console.log('inited OK');
		var templater = new this.Templater({
			templaterDir: 'templates',
			debugTemplates: 1
		});

		var serv = this.http.createServer().listen(8080);
		serv.on('request',function(request,response){
			console.time('time');
			if(request.url === '/'){
				templater.render({
					tpl: '_global',
					data: {
						scope: {
							name: 'Test_var',
							auth: 1,
							arr: [
								{
									name: 1,
									val: 1
								},
								{
									name: 2,
									val: 2
								},
								{
									name: 3,
									val: 3
								},
								{
									name: 4,
									val: 4
								}
							]
						},
						global: {
							ver: '2.0'
						}
					},
					callback: function(data){
						//console.log(data);
						response.writeHead('200');
						response.end(data);
						console.timeEnd('time');
					}
				});		
			}
			else {
				response.writeHead('404');
				response.end('');
			}		
		});

		
	}