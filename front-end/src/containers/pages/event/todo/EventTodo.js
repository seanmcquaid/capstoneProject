import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

import AddForm from '../../../Forms/AddForm';
import PlaceCards from '../../../../components/Lists/PlaceCards/PlaceCards'
import Button from '../../../../components/utility/button/Button'
import './EventTodo.css'
import Filter from '../../../../components/utility/filterDropDown/Filter';



class EventTodo extends Component {
    constructor() {
        super()
        this.state = {
            list: [],
            types: ['Festival','Arts/Movies/Music', 'Sporting Events', 'Educational'],
            msg: "",
            showAlert: false,
        }
    }

    componentDidMount() {
        // console.log('component did mount')
        axios({
            method: 'POST',
            url: `${window.apiHost}/event/getEventList`,
            data: {
                email: this.props.login.email
            }
        }).then((eventListFromDB) => {
            // console.log(foodListFromDB)
            this.setState({
                list: eventListFromDB
            })
        })
    }

    addNewEvent = (event, type, text) => {
        // possibly, api call will go here with autocomplete to add name, location to DB
        // console.log(place, type)
        axios({
            method: 'POST',
            url: `${window.apiHost}/event/addEvent`,
            data: {
                eventname: event,
                type: type,
                note: text,
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            // console.log(backEndResponse)
            this.setState({
                list: backEndResponse
            })
        })
    }

    addToFavorites = (eventname) => {
        axios({
            method: "POST",
            url: `${window.apiHost}/event/addFave/${eventname}`,
            data: {
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            console.log(backEndResponse)
            this.setState({
                list: backEndResponse,
                msg: "Success! Added to favorites",
                showAlert: true
            })
        })
    }

    editEvent = (eventname) => {
        //edit note/name of place
    }

    removePlace = (eventname) => {
        //easy, just delete from DB!
        console.log(this.props.login.email)
        axios({
            method: "POST",
            url: `${window.apiHost}/event/deleteEvent/${eventname}`,
            data: {
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            console.log(backEndResponse)
            this.setState({
                list: backEndResponse
            })
        })
    }

    filterResults = (filter) => {
        console.log(filter)
        axios({
            method: 'POST',
            url: `${window.apiHost}/event/filter/${filter}`,
            data: {
                type: filter,
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            // console.log(backEndResponse)
            this.setState({
                list: backEndResponse
            })
        })

    }

    render() {
        if (this.state.list.data !== undefined) {
            var eventToDo = this.state.list.data.map((event, i) => {
                console.log(event)
                return (
                    <div key={i} className="placeCard">
                        <div className="cardLeft">
                            <h4>{event.placename}</h4>
                            <div>
                                <p>{event.note}</p>
                            </div>
                        </div>
                        <div className="buttonContainer">
                            <Button clicked={() => this.addToFavorites(event.placename)} className="faveButton">Fave</Button>
                            <Button clicked={() => this.editPlace(event.placename)} className="editButton">Edit</Button>
                            <Button clicked={() => this.removePlace(event.placename)} className="deleteButton">Remove</Button>
                        </div>
                        
                    </div>
                )
            })
        }

        const typeArray = this.state.types.map((type, i)=>{
            return (<option key={i} value={type}>{type}</option>)
        })

        const filterArray = this.state.types.map((filter, i)=>{
            return(<option key={i} value={filter}>{filter}</option>)
        })
        

        return (
            <div className="eventToDo">
                <h2>Food To Do!</h2>
                <SweetAlert
                    show={this.state.showAlert}
                    title="Added to Faves"
                    text={this.state.msg}
                    onConfirm={() => this.setState({ showAlert: false })}
                />
                <AddForm
                    addNewPlace={this.addNewEvent}
                    placeholder="Add new place to eat..."
                    textType="Add note..."
                    defaultType="Choose type!" 
                    types={typeArray}
                />
                <Filter 
                    defaultFilter="Filter by type"
                    filters={filterArray}
                    filterResults={this.filterResults}
                />
                <PlaceCards cards={eventToDo}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

export default connect(mapStateToProps, null)(EventTodo);