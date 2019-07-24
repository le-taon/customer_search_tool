<?
    require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
    global $USER_LOGIN;
    $USER_LOGIN = CUser::GetLogin();
?>

<!DOCTYPE HTML>

<html>

    <head>
        <meta charset = "utf-8">
        <title>Портфель</title>
        <script type="text/javascript">
        	const USER_LOGIN = "<?=$USER_LOGIN?>";
        </script>
        <script
            src="https://code.jquery.com/jquery-3.4.1.js"
            integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
            crossorigin="anonymous">
        </script>
        <!-- Скрипты и стили datatables -->
        <link 
            rel="stylesheet"
            type="text/css"
            href="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.18/af-2.3.3/b-1.5.6/b-colvis-1.5.6/b-flash-1.5.6/b-html5-1.5.6/cr-1.5.0/fc-3.2.5/fh-3.1.4/kt-2.5.0/r-2.2.2/rg-1.1.0/rr-1.2.4/sc-2.0.0/sl-1.3.0/datatables.min.css"/>
 
        <script 
            type="text/javascript"
            src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.18/af-2.3.3/b-1.5.6/b-colvis-1.5.6/b-flash-1.5.6/b-html5-1.5.6/cr-1.5.0/fc-3.2.5/fh-3.1.4/kt-2.5.0/r-2.2.2/rg-1.1.0/rr-1.2.4/sc-2.0.0/sl-1.3.0/datatables.min.js">
        </script>

		<!-- Основной скрипт и стили -->
        <link rel="stylesheet" type="text/css" href="sources/portfolio.css">
        <script type="text/javascript" src="sources/portfolio.js">

    	</script>
    </head>
    <body>
    	<header><h1><b>Тинькофф</b> Портфель</h1></header>
		<div id='buttons'></div>
        <div id='table_container'></div>
    </body>
</html>