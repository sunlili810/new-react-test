import { observable } from 'mobx';
import Ajax from 'util/ajax';

export default class Logintstore {
	@observable data = {
	  list: []
	};

	lineday(param) {
	  const params = {
	    ...param
	  };
	  Ajax.fetch(params);
	}
}
