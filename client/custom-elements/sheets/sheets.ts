import './stylesheet.styl';
import '../../shared/custom-module.css';
import Spreadsheet from 'x-data-spreadsheet';
import { debounce } from '../../../common/utils/debounce';
import { tryParseJSON } from '../../../common/utils/utils';

type SheetData = {};

const updateDataInCloud = debounce((data: SheetData) => {
  CustomElement.setValue(JSON.stringify(data));
}, 300);

CustomElement.init((element, _context) => {
  let value: SheetData = tryParseJSON(element.value || '', {});
  CustomElement.setHeight(((element.config || {}) as any).height || 400);
  document.querySelector('#spreadsheet-root')!.innerHTML = '';
  const sheet = new Spreadsheet('#spreadsheet-root', element.config || {});
  sheet.loadData(value);
  const keepTheSameValue = () => sheet.loadData(value);
  const saveValue = (data: SheetData) => {
    value = data;
    updateDataInCloud(data);
  };
  sheet.change(element.disabled ? keepTheSameValue : saveValue);

  CustomElement.onDisabledChanged(disabled => {
    value = sheet.data;
    sheet.change(disabled ? keepTheSameValue : saveValue);
  });
});
