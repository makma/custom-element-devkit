import './stylesheet.styl';
import Spreadsheet from 'x-data-spreadsheet';
import { debounce } from '../../../common/utils/debounce';
import { tryParseJSON } from '../../../common/utils/utils';

type SheetData = {};

const updateDataInCloud = debounce((data: SheetData) => {
  CustomElement.setValue(JSON.stringify(data));
}, 300);

CustomElement.init((element, _context) => {
  CustomElement.setHeight(((element.config || {}) as any).height || 400);
  document.querySelector('#spreadsheet-root')!.innerHTML = '';
  new Spreadsheet('#spreadsheet-root', element.config || {})
    .loadData(tryParseJSON(element.value || '', {}))
    .change(updateDataInCloud);
});
