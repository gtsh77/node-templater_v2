<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="../styles/style.css">
	<title>Document</title>
	<meta version="{{global.ver}}">
</head>
<body>
	<div class="wrapper" name="{{scope.name}}" data-id="index">
		<div>
{{template.t1}}
		</div>
		<div>
			<!-- {{IF scope.auth == 1}} -->
				<span>User Authed1</span>
				<span>[[scope.arr]]</span>
			<!-- {{ELSE}} -->
				<span>User not-Authed1</span>
			<!-- {{END}} -->
		</div>	
		<div>
			<!-- {{IF scope.auth == 1}} -->
				<span>User Authed2</span>
			<!-- {{ELSE}} -->
				<span>User not-Authed2</span>	
			<!-- {{END}} -->
		</div>
		<div>
			<!-- {{IF scope.auth}} -->
				<span>User Authed3</span>

			<!-- {{END}} -->
		</div>
		
			<!-- {{WHILE: scope.arr}} -->
			<div>
				<span>[[scope.name]]</span>
				<span>[[name]]</span>
				<span>[[val]]</span>
			</div>
			<!-- {{END}} -->
			<!-- {{WHILE: scope.arr}} -->
			<div>
				<span>[[scope.name]]</span>
				<span>[[name]]</span>
				<span>[[val]]</span>
			</div>
			<!-- {{END}} -->				


		
	</div>
	<script src="../libs/jquery-1.11.3.min.js"></script>
</body>
</html>