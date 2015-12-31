	render: function(opts){
		var that = this,
			html = '',
			mark = '',
			i = j = 0,
			marks = null,			
			numOfMarks = 0,
			completedMarks = 0,
			logicBlocks = null,
			logickBlock = '',
			numOfLogickBlocks = 0,
			completedLogickBlocks = 0,
			whileBlocks = null,
			numOfWhileBlocks = 0,
			completedWhileBlocks = 0,
			whileBlock = '',
			whileBlockArrayLength = 0,
			whileBlockHTMLCode = '',
			whileBlockHTMLCode2 = '',
			whileBlockMarks = null,
			status = new this.EventEmitter();

		if(opts.data) that.data = opts.data;

		status.on('nextMark',function(){
				completedMarks++;
				prepareMark();	
		});	

		status.on('nextLogickBlock',function(){
				completedLogickBlocks++;
				prepareLogickBlock();
		});		

		status.on('nextWhileBlock',function(){
				completedWhileBlocks++;
				prepareWhileBlock();
		});	

		function prepareWhileBlock(){

			if(completedWhileBlocks<numOfWhileBlocks){
				whileBlock = whileBlocks[completedWhileBlocks].match(/(<!-- {{WHILE: (\w+)\.(\w+)}} -->([^{]+)([^{]+)?<!-- {{END}} -->)/);

				whileBlockMarks = whileBlocks[completedWhileBlocks].match(/(?:[{\[]+[a-z0-9\.]+[}\]]+)/g);

				whileBlockArrayLength = that.data[whileBlock[2]][whileBlock[3]].length;	
				whileBlockHTMLCode = '';
				whileBlockHTMLCode2 = whileBlock[4];

				for(i=0;i<whileBlockArrayLength;i++){
					for(j=0;j<whileBlockMarks.length;j++){						
							whileBlockCurrentMark = whileBlockMarks[j].match(/(?:[\[{]+([^\]}]+)[}\]]+)/);

							if(whileBlockCurrentMark[1].search(/\./) > 0){
								continue;
							}							
							else {
									whileBlockHTMLCode2 = whileBlockHTMLCode2.replace(whileBlockMarks[j],that.data[whileBlock[2]][whileBlock[3]][i][whileBlockCurrentMark[1]]);
							}	
					}

					whileBlockHTMLCode += whileBlockHTMLCode2;
					whileBlockHTMLCode2 = whileBlock[4];
				}

				html = html.replace(whileBlock[0],whileBlockHTMLCode);
				status.emit('nextWhileBlock');
			}
		}

		function prepareLogickBlock(){
			if(completedLogickBlocks<numOfLogickBlocks){
				logickBlock = logicBlocks[completedLogickBlocks].match(/(<!-- {{IF (\w+)\.(\w+)(?: (==|>=|<=))?(?: (\w+))?\s?}} -->([^{]+)(?:<!-- {{ELSE}} -->)?([^{]+)?<!-- {{END}} -->)/);
				//do Calcs
				if(logickBlock[4] && logickBlock[5]){
					if(logickBlock[4] === '=='){
						if(that.data[logickBlock[2]][logickBlock[3]] == logickBlock[5]){
							html = html.replace(logickBlock[0],logickBlock[6]);
						}
						else {
							if(logickBlock[7]) html = html.replace(logickBlock[0],logickBlock[7]);
							else html = html.replace(logickBlock[0],'');							
						}
					}
					if(logickBlock[4] === '>='){
						if(that.data[logickBlock[2]][logickBlock[3]] >= logickBlock[5]){
							html = html.replace(logickBlock[0],logickBlock[6]);
						}
						else {
							if(logickBlock[7]) html = html.replace(logickBlock[0],logickBlock[7]);
							else html = html.replace(logickBlock[0],'');							
						}
					}
					if(logickBlock[4] === '<='){
						if(that.data[logickBlock[2]][logickBlock[3]] <= logickBlock[5]){
							html = html.replace(logickBlock[0],logickBlock[6]);
						}
						else {
							if(logickBlock[7]) html = html.replace(logickBlock[0],logickBlock[7]);
							else html = html.replace(logickBlock[0],'');							
						}
					}
				}
				else {
					if(that.data[logickBlock[2]][logickBlock[3]]){
						html = html.replace(logickBlock[0],logickBlock[6]);
					}
					else {
						if(logickBlock[7]) html = html.replace(logickBlock[0],logickBlock[7]);
						else html = html.replace(logickBlock[0],'');
					}
				}
				status.emit('nextLogickBlock');
			}
		}

		function prepareMark(){
			if(completedMarks<numOfMarks){
				mark = marks[completedMarks].match(/(?:[\[{]+([^\]}]+)[}\]]+)/)[1].split('.');
				//она обычная?
				if(mark[0] === 'scope'){
					html = html.replace(marks[completedMarks],that.data.scope[mark[1]]);
					status.emit('nextMark');
				}
					//глобальная?
					else if(mark[0] === 'global'){
						html = html.replace(marks[completedMarks],that.data.global[mark[1]]);
						status.emit('nextMark');
					}
					//ищем компонент
					else if(mark[0] === 'component'){}
					//ищем простой шаблон
					else if(mark[0] === 'template'){
						that.render({
							tpl:mark[1],
							callback:function(code){
								html = html.replace(marks[completedMarks],(that.config.debugTemplates)?'<!-- TEMPLATE START '+that.config.templaterDir+'/'+mark[1]+'.tpl -->'+code+'<!-- TEMPLATE END '+that.config.templaterDir+'/'+mark[1]+'.tpl -->':code);
								status.emit('nextMark');
							}
						});
					}
				else {}		
				
			}
			else {
				if(typeof opts.callback === 'function') {
					opts.callback(html);
				}				
			}
		}

		this.reader.eachLine(this.config.templaterDir+'/'+opts.tpl+'.tpl',function(line,last){
			line += '\n';
			html += line;

			if (last) {

				whileBlocks = html.match(/(<!-- {{WHILE: (\w+)\.(\w+)}} -->([^{]+)([^{]+)?<!-- {{END}} -->)/g);

				if(whileBlocks){
					numOfWhileBlocks = whileBlocks.length;
					prepareWhileBlock();
				}

				logicBlocks = html.match(/(<!-- {{IF (\w+)\.(\w+)(?: (==|>=|<=))?(?: (\w+))?\s?}} -->([^{]+)(?:<!-- {{ELSE}} -->)?([^{]+)?<!-- {{END}} -->)/g);

				if(logicBlocks){
					numOfLogickBlocks = logicBlocks.length;
					prepareLogickBlock();
				}

				//console.log(logicBlocks);
				marks = html.match(/(?:[{\[]+[a-z0-9\.]+[}\]]+)/g);

				//console.log(marks);
				if(marks){
					numOfMarks = marks.length;					
				}
				prepareMark();
    			return false; // stop reading
  			}
		});
	}