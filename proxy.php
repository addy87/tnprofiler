<?php
  header('Content-Type: application/json');
  switch ($_REQUEST["richiesta"]) {
  	case 'eta':
  		echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=448&info=d&fmt=json");
  		break;
  	case 'eta_maschi':
  		echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=425&info=d&fmt=json");
  		break;
  	case 'eta_femmine':
  		echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=426&info=d&fmt=json");
  		break;
    case 'maschi_vs_femmine':
      echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=342&info=d&fmt=json");
      break;
    case 'diplomati':
      echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=131&info=d&fmt=json");
      break;
    case 'stranieri':
      echo file_get_contents("http://www.statweb.provincia.tn.it/indicatoristrutturalisubpro/exp.aspx?idind=253&info=d&fmt=json");
      break;
  	default:
  		break;
  }
  
?>