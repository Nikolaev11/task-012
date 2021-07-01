import './App.css';
import React from 'react';
import {characteristics, productsSource} from './data.js';
import { ReactComponent as SelectArrows } from './selectArrows.svg';
import { ReactComponent as SvgTrue } from './svgTrue.svg';
import { ReactComponent as SvgFalse } from './svgFalse.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.maxDisplay = 6;
    const displayDefault = productsSource.length <= 2 ? productsSource.length : 3;
    this.products = productsSource.map((elem, index) => {elem.id = index+101; return elem})
    const productsIdList = this.products.map( (elem, index) => index+1 <= displayDefault ? {id: elem.id, display: true} : {id: elem.id, display: false} )

    this.state = { dispayCount: displayDefault,
    productsIdList: productsIdList,
    isShownDifference: false,
    modalActiveId: 0,
    serchText: ''};
  }

  setDispayCount = (numberDisplay) => (e) => {
    e.preventDefault();
    if (this.state.dispayCount === numberDisplay) return;
    const displayIdList = this.state.productsIdList.filter((elem) => elem.display === true);
    const displayNoneIdList = this.state.productsIdList.filter((elem) => elem.display === false);
    const productsIdList = [...displayIdList, ...displayNoneIdList].map( (elem, index) => index+1 <= numberDisplay ? {id: elem.id, display: true} : {id: elem.id, display: false} )
    this.setState({ dispayCount: numberDisplay, productsIdList: productsIdList, modalActiveId: 0, serchText: ''});
  };

  isShownDifferenceChange = () => {
    this.setState({ isShownDifference: !this.state.isShownDifference });
  }

  showModelChangeWindow = (id) => (e) => {
    this.setState({ modalActiveId: id });
    this.modalLeft = e.target.offsetLeft
    this.modaltop = e.target.offsetTop
  }

  textChange = (e) => {
    e.preventDefault();
     this.setState({ serchText: e.target.value });
  };

  itemChange = (nextId, previosId) => (e) => {
    e.preventDefault();
    const displayIdList = this.state.productsIdList.filter((elem) => elem.display === true);
    const displayNoneIdList = this.state.productsIdList.filter((elem) => elem.display === false);
    displayIdList.find((elem) => elem.id === previosId).id = nextId;
    displayNoneIdList.find((elem) => elem.id === nextId).id = previosId;
    const displayNoneIdListSorted = displayNoneIdList.sort((a,b) => {if (a.id > b.id) return 1; if (a.id < b.id) return -1;})
    this.setState({productsIdList: [...displayIdList, ...displayNoneIdListSorted], modalActiveId: 0, serchText: '' });
  }

  render () {
    const outputCharact =(input) => {
      if (typeof input === 'boolean' && input === true) return <SvgTrue/>;
      if (typeof input === 'boolean' && input === false) return <SvgFalse/>;
      return input.toString();
    }
    const items = this.state.productsIdList.filter((elem) => elem.display === true)
    .map((elem) => this.products.find((item) => item.id === elem.id));
    const itemsNoDispaly = this.state.productsIdList.filter((elem) => elem.display === false)
    .map((elem) => this.products.find((item) => item.id === elem.id));
    const displayNumbers = this.state.productsIdList.filter((elem, index) => index > 0)
    .map((elem, index) => index+1 < this.maxDisplay ? index+2 : null)
    .filter((elem) => !(elem === null));

    return (
      <React.Fragment>
        <div className="header-background" >
          <div className="header">
            <div className='catalog'>Каталог</div>
            <div className='compare uppercase'>Сравнение</div>
            <div className='lk'>Личный Кабинет</div>
          </div>
        </div>
        <div className="tablehead-background" >
          <div className="compare-head">
            <div className="compare-head-left"><span>Смартфоны</span></div>
              <div className="compare-head-right">
                <span>Отобразить товары:{'\u00A0'}
                {displayNumbers.map((elem) =>
                  <React.Fragment>
                    <button className="set-dispaycount-button"
                      style={this.state.dispayCount === elem ? {textDecoration: 'underline'} : {textDecoration: 'none'}}
                      onClick={this.setDispayCount(elem)}>
                      {elem}
                      </button>
                  </React.Fragment>)}
                  </span>
              </div>
            </div>
            <div className="tablehead">
              <div className="first-column tablehead-cell">
                <label>
                  <input className="input-checkbox"name="isShownDifference" type="checkbox" checked={this.state.isShownDifference} onChange={this.isShownDifferenceChange}/>
                  Показать различия
                </label>
              </div>
              {items.map((elem) => { return (
                <div style={{ width: `${860/this.state.dispayCount}px` }} className="other-column tablehead-cell">
                  <div>
                    <img className="other-column-img" src={`images/${elem.image}`} alt={elem.model}></img>
                      {itemsNoDispaly.length === 0 ? null :
                        elem.id === this.state.modalActiveId
                        ? <div className={`modal ${itemsNoDispaly.length >= 3 ? 'modal-big' : 'modal-small'}`} style={{left: this.modalLeft}}>
                        {itemsNoDispaly.length >= 3 ? <input type='text' value={this.state.serchText} onChange={this.textChange} placeholder='Поиск'/> : null}
                        {itemsNoDispaly.filter((item) => item.model.toLowerCase().indexOf(this.state.serchText.toLowerCase()) >= 0).map((itemNoDispaly) =>
                        <div className='div-select'>
                          <div onClick={this.itemChange(itemNoDispaly.id, elem.id)} className='select-arrows'><SelectArrows /></div>
                            <img src={`images/${itemNoDispaly.image}`} alt={itemNoDispaly.model}></img>
                            <div className='div-select-model'>{itemNoDispaly.model}</div>
                          </div>)}
                        </div>
                        : <div className="modal-placeholder" onClick={this.showModelChangeWindow(elem.id)}><div className='arrow-down'></div></div>}
              </div>
            <div>{elem.model}</div>
            </div>) } )}
          </div>
      </div>
      <div className="tablebody-background">
        {Object.keys(characteristics).map( (characteristic) => {return (
        !this.state.isShownDifference || !items.every((elem) => elem[characteristic] === items[0][characteristic]) ?
        <React.Fragment>
          <div className="tablebody-row">
          <div className="first-column table-cell uppercase">{characteristics[characteristic]}</div>
          {items.map( (item) => { return <div className="other-column table-cell">{outputCharact(item[characteristic])}</div> } )}
          </div>
        </React.Fragment>
        : null)})}
      </div>
    </React.Fragment>);
  }
}
export default App;
