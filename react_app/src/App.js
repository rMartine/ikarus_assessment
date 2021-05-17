import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { getUserLocale } from 'get-user-locale';
import poke_dex from './poke_dex.jpg';
import './App.css';
// import Modal from 'react-modal';
import { Modal } from '@material-ui/core';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import LaunchIcon from '@material-ui/icons/Launch';

function App() {
  const [pokes, setPokes] = useState([]);
  const [usrLocale, setUsrLocale] = useState('english');
  const [currPokemon, setCurrPokemon] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const pokemonEndPoint = '/pokemon_api';
  const pokemonPicPath = 'http://img.pokemondb.net/artwork/'
  const userLocale = () => {
    const locale = getUserLocale().split('-')[0].toLowerCase();

    switch (locale) {
      case 'en':
        return 'english';
      case 'ja':
        return 'japanese';
      case 'zh':
        return 'chinese';
      case 'fr':
        return 'french';
      default:
        return 'english';
    }
  };
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  const openModal = () => {
    setDetailVisible(true);
  }

  const closeModal = () => {
    setDetailVisible(false);
  }

  const modalComponent = () =>{
    return (
      <Modal
        open={ detailVisible }
        onClose={ closeModal }
        className="Modal-container"
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="Modal-body">
          <header className="Modal-header">
            <h4>{ "Detailed view of ".concat(currPokemon.name.english).concat(" stats") }</h4>
            <span onClick={() => closeModal()}>close</span>
          </header>
          <div className="Modal-main">
            <div className="Detail-div-pic">
              <img alt={'pokemon image '.concat(currPokemon.name.english)}
                   src={ pokemonPicPath.concat(currPokemon.name.english).toLowerCase().concat('.jpg') }
                   className="Detail-pic" />
            </div>
            <div className="Detail-about">
              <div className="Detail-about-segment">
                <div className="Detail-header"><h4>Name in other languages</h4></div>
                <ul className="Detail-list">
                  { Object.keys(currPokemon.name).map((key, idx) => <li key={ idx } className="Detail-name">{ key + ": " + currPokemon.name[key] }</li>) }
                </ul>
              </div>
              <div className="Detail-about-segment">
                <div className="Detail-header"><h4>Type</h4></div>
                <div className="Detail-list">
                  { currPokemon.type.map((tipo, idx) => <div key={ idx } className={ tipo.concat(" Detail-type") }>{ tipo }</div>) }
                </div>
              </div>
            </div>
            <div className="Detail-about">
              <div className="Detail-about-segment">
                <div className="Detail-header"><h4>Detailed Stats</h4></div>
                <ul className="Detail-list">
                  { Object.keys(currPokemon.base).map((key, idx) => <li key={ idx } className="Detail-name">{ key + ": " + currPokemon.base[key] }</li>) }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  useEffect(() => {
    fetch(pokemonEndPoint)
      .then(res => res.json())
      .then(res => setPokes(res.poke_list))
      .catch(err => console.log("Error fetching Pokemon list: " + err));
    setUsrLocale(userLocale());
  }, []);

  return (
    <div className="App">
      <div className="App-top">
        <img src={poke_dex} className="App-dex" alt="logo" />
      </div>
      <div className="App-bottom">
        <MaterialTable
          onRowClick={(event, rowData) => {
            setCurrPokemon(rowData);
            openModal();
          }}
          actions={[
            {
              icon: LaunchIcon,
              tooltip: 'Open Detail',
              onClick: (event, rowData) => {
                setCurrPokemon(rowData);
                openModal();
              }
            }
          ]}
          title = 'List of Known Pokemons'
          icons={tableIcons}
          columns = {[
            { title: '#', field: 'id', render: rowData => <div className="Tb-id-list"><div className="Tb-id">{ rowData.id.toString().padStart(3, '0') }</div><div className="Tb-image"><img alt={'pokemon image '.concat(rowData.name.english)} className="Image-avatar" src={ pokemonPicPath.concat(rowData.name.english).toLowerCase().concat('.jpg') }/></div></div>},
            { title: 'Name', field: 'name.'.concat(usrLocale)},
            { title: 'Type', field: 'type', render: rowData => <div className="Tb-type-list">{ rowData.type.map((tipo, idx) => <div key={ idx } className={ tipo.concat(" Tb-type") }>{ tipo }</div>) }</div>},
            { title: 'Total', field: 'base', render: rowData => (rowData.base.HP + rowData.base.Attack + rowData.base.Defense + rowData.base["Sp. Attack"] + rowData.base["Sp. Defense"] + rowData.base.Speed)},
            { title: 'HP', field: 'base.HP'},
            { title: 'Attack', field: 'id'},
            { title: 'Defense', field: 'id'},
            { title: 'Sp. Attack', field: 'id'},
            { title: 'Sp. Defense', field: 'id'},
            { title: 'Speed', field: 'id'}
          ]}
          data={pokes}
          // other props
          options = {{
            search: true,
            sorting: true
          }}
        />
      </div>
      { currPokemon && modalComponent() }
    </div>
  );
}

export default App;
