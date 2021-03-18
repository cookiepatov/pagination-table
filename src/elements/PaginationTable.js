import * as React from 'react';
import Loader from '../loaders/Loader';
import {cloneData} from '../utils/utils'
import '../style/paginationTableStyle.css'

export default class PaginationTable extends React.Component {
    constructor(props) {
        super(props);
        this._url = this.props.dataUrl;
        this._maxElements = this.props.maxElements;
        this.state = {
            data: {},
            headers: {},
            cells: {},
            pages: {},
            sortOrders: [],
            currentPage: 0
        };
    }


    componentDidMount() {
        this._setData();
    }

    // Загрузка данных из JSON по ссылке и первоначальная установка всех параметров
    _setData() {
        const loader = new Loader(this._url);
        loader.getData().then(res => {
            this.setState({ data: res });
            this._updateCells();
            this._setupSortOrders();
            this._originalData = cloneData(res);
        });
    }

    // Обновление отображаемых данных

    _updateCells() {
        this._setupHeaders();
        this._setupPages();
        this._setupCells(0);
    }

    // Установка заголовков

    _setupHeaders() {

        const headers = this.state.data.cols.map((element, index) => {
            const headerState = this.state.sortOrders[index];
            let headerSortClass = '';
            switch (headerState) {
                case 0 : {
                    headerSortClass = 'table__cell_sort_down';
                    break;
                }
                case 1 : {
                    headerSortClass = 'table__cell_sort_up';
                    break;
                }
            }
            return <button type='button' 
            onClick={()=> {this._handleHeaderClick(index)}}
            className={`table__cell table__cell_type_header ${headerSortClass}`} 
            key={`${element}_${index}`}>{element}</button>;
        });
        this.setState({ headers: headers });
    }

    // Установка значений ячеек на текущей странице

    _setupCells(n) {
        const cellsData = this.state.pages.length ? this.state.pages[n].flat(2) : [];
        const cells = cellsData.map((element, index) => {
            return <div className={'table__cell'} 
            key={`${element}_${index}`}>{element}</div>;
        })
        document.querySelector('.table').scrollTo(0, 0);
        this.setState(
            {
                cells: cells,
                currentPage: n,
            });
    }

    // Распределение данных по страницам

    _setupPages() {
        const pages = [];
        let page=[];
        const rows = this.state.data.data;
        rows.forEach((element, index) => {
            page.push(element);
            if(!((index+1)%this._maxElements)) {
                pages.push(page);
                page=[];
            }
            else if(index+1===rows.length) {
                pages.push(page);
            }
        });
        this.setState({pages: pages});
    }

    // Первоначальная установка сортировки (значения не сортируются)

    _setupSortOrders() {
        const sortOrders=[]
        this.state.pages.forEach(() => sortOrders.push(null));
        this.setState({sortOrders: sortOrders});
    }

    // Обработчик клика по заголовку колонки

    _handleHeaderClick(i) {
        this._sortColumn(i);
    }

    // Обработчик изменения фильтрации

    _handleFilterInput(e) {
        this._filterData(e.target.value);
    }

    // Отображение навигатора по страницам

    _pagesNavigation() {
        const links = this.state.pages.map((element, index) => {
            const className = (this.state.currentPage===index) ?
            'navigator__button navigator__button_current' : 'navigator__button';
            return <button className={className} 
            key={`${element}_${index}`} 
            type='button' 
            onClick={()=>{this._setupCells(index)}}>{index+1}</button>
        });
        return links
    }

    // Пересортировка колонки

    _sortColumn(i) {
        const sortOrders = this.state.sortOrders.slice();
        const columnSortState = sortOrders[i];
        let newCellsData;
        let newOrder;
        const newData = cloneData(this.state.data);
        switch (columnSortState) {
            case null : {
                newOrder = 0;
                newCellsData = this.state.data.data.sort((a, b)=>{
                    return a[i]>b[i] ? 1 : -1;
                })
                break;
            }
            case 0 : {
                newOrder = 1;
                newCellsData = this.state.data.data.sort((a, b)=>{
                    return a[i]>b[i] ? -1 : 1;
                })
                break;
            }
            case 1 : {
                newOrder = 0;
                newCellsData = this.state.data.data.sort((a, b)=>{
                    return a[i]>b[i] ? 1 : -1;
                })
                break;
            }
        }
        newData.data = newCellsData;
        this.setState({data:newData});
        this._setNewSortOrders(i, newOrder);
        setTimeout(()=>this._updateCells(),0);
    }

    // Установка новых значений сортировки колонок

    _setNewSortOrders(i, columnSortState) {
        const newOrders = this.state.sortOrders.slice()
        .map((order, index)=>{return (index===i) ? columnSortState : null});
        this.setState({sortOrders:newOrders});
    }

    // Фильтрация значений

    _filterData(searchStr) {
        searchStr = searchStr.toLowerCase();
        const newData = cloneData(this._originalData);
        if(searchStr.length>0) {
            const newRows = newData.data.filter(row => {
                let keep = false;
                row.forEach(value=>{
                    if((value+'').toLowerCase().includes(searchStr)) {
                        keep = true
                    }
                })
                return keep;
            })
            newData.data = newRows;
        }
        this.setState({data:newData});
        setTimeout(()=>this._updateCells());
    }



    render() {
        return (
        <div className={'table-container'}>
        <span>Поиск</span>
        <input type='text' className={'table-container'} 
        onInput={(e)=>this._handleFilterInput(e)}></input>
            <div className={'table'}>
                {this.state.headers.length>0 && this.state.headers}
                {this.state.cells.length>0 && this.state.cells}
            </div>
            <nav>{this.state.pages.length>0 && this._pagesNavigation()}</nav>
        </div>
        );

    }
}
