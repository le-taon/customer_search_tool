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
        <!-- Получаем инфу о текущем юзере -->
        <script type="text/javascript">
        	const USER_LOGIN = "<?=$USER_LOGIN?>";
        </script>

        <!-- JQuery -->
        <script
            src="https://code.jquery.com/jquery-3.4.1.js"
            integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
            crossorigin="anonymous">
        </script>

        <!-- Vue.js -->
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

        <!-- Скрипты и стили datatables -->
        <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/cr-1.5.0/fh-3.1.4/kt-2.5.0/r-2.2.2/sl-1.3.0/datatables.min.css"/>
 
        <script
            type="text/javascript"
            src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/cr-1.5.0/fh-3.1.4/kt-2.5.0/r-2.2.2/sl-1.3.0/datatables.min.js">
        </script>

		
    </head>
    <body>
    	<header><h1><b>Тинькофф</b> Портфель</h1></header>
		<div id="vue-body">
            <customers-table 
                v-bind:customers="customers"
                ref="c_table"></customers-table>
        </div>
        <!-- Основной скрипт и стили -->
        <script type="text/javascript" src="sources/portfolio.js"></script>
        <link rel="stylesheet" type="text/css" href="sources/portfolio.css">
    </body>
</html>