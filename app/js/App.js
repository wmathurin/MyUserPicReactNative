/*
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const React = require('react-native');
const {
    AppRegistry,
    Navigator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} = React;
const UserPic = require('./UserPic.js');
const oauth = require('./react.force.oauth.js');

const initialRoute = {name: 'My User Picture'};

// Nav element
const NavButton = React.createClass({
    render () {
        return (<View style={styles.navBarElt}>
                  <TouchableOpacity onPress={() => this.props.onPress()}>
                    <Text style={styles.navBarText}>{this.props.title}</Text>
                  </TouchableOpacity>
                </View>);
    }
});

// Router
const NavigationBarRouteMapper = {
    LeftButton (route, navigator, index, navState) {
        return null;
    },
    
    RightButton (route, navigator, index, navState) {
        return (<NavButton title="Logout" onPress={() => oauth.logout()} />);
    },

    Title (route, navigator, index, navState) {
        return (<View style={styles.navBarElt}><Text style={styles.navBarTitleText}> {route.name} </Text></View>);
  },

};

module.exports = React.createClass({
    getInitialState () {
        return {
            authenticated: false
        };
    },
    
    componentDidMount () {
        oauth.authenticate(
            () => {
                this.setState({authenticated:true});
            },
            (error) => {
                console.log('Failed to authenticate:' + error);
            }
        );
    },

    render () {
        if (!this.state.authenticated)
            return (<View/>); // Show splash screen if you have one
        
        return (<Navigator
                style={styles.container}
                initialRoute={initialRoute}
                configureScene={() => Navigator.SceneConfigs.PushFromRight}
                renderScene={(route, navigator) => (<UserPic/>)}
                navigationBar={<Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={styles.navBar} />} />);
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navBar: {
        backgroundColor: 'red',
        height: 56,
    },
    navBarElt: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        margin: 2,
    },
    navBarTitleText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
});