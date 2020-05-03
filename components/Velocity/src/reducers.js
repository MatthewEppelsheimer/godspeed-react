import { log } from './log';
import { indexData } from './search';


const dataReducer = (data, action) => {
	switch(action.type) {
		case 'create':
			try {
				data.unshift(action.newRecord);
				return indexData(data);
			} catch(error) { log(error) }
			break;

		default:
			log(new Error('unrecognized action.type'));
			break;
	}
};

export {
	dataReducer
};
