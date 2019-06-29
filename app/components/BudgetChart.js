import React from "react";
import { StyleSheet, View, Text } from "react-native";
import firebase from 'react-native-firebase';
import * as Progress from 'react-native-progress';

export default class BudgetChart extends React.Component {
    constructor() {
        super();
        this.budget = firebase.firestore().collection('budget');
        this.unsubscribe = null;
        this.key = null;

        this.state = {
            loading: true,
            data: []
        };
    }

    componentDidMount() {
        this.unsubscribe = this.budget.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const data = [];

        querySnapshot.forEach((doc) => {
            const { amount, categories, currAmount, endDate, startDate, title } = doc.data();
            
            data.push({
                key: doc.id,
                doc, // DocumentSnapshot
                amount,
                currAmount,
                title
            });
        });
        
        this.setState({ 
            data,
            loading: false,
         });
    }

    render() {
        if (this.state.loading) {
            return null; // or render a loading icon
        }

        return (
            <View>
                <View>
                {this.state.data.map((bud) => {
                    const progressPercentage = bud.currAmount / bud.amount;
                    return (
                        <View key = {bud.doc.id}>
                            <Progress.Bar 
                            progress = { progressPercentage } 
                            width = {200} 
                            color = "#E42C64"
                            unfilledColor = "#FFFFFF"
                            borderColor = "#FFFFFF"
                            />
                        </View>
                    );
                })}
                </View>             
                </View>
        );
    }
}