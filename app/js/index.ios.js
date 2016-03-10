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

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    NavigatorIOS
} = React;
var forceClient = require('./react.force.net.js');

var App = React.createClass({
    render: function() {
        return (
            <NavigatorIOS
                style={styles.container}
                initialRoute={{
                    title: 'My User Picture',
                    component: UserPic,
                }}
            />
        );
    }
});

var UserPic = React.createClass({
    componentDidMount: function() {
        var that = this;
        forceClient.sendRequest('/services/data', '/v36.0/chatter/users/me', 
                                function(response) {
                                    var photoUrl = response.photo.largePhotoUrl;
                                    that.setState({
                                        photoUrl: photoUrl
                                    });
                                },
                                function(error) {
                                }, 
                                'GET', 
                                {}, 
                                {'X-Connect-Bearer-Urls': 'true'});

    },

    render: function() {
        var image = this.state
                     ? (<Image style={styles.photo} source={{uri: this.state.photoUrl}} />)
                     : (<Text>Loading</Text>);

        return (
            <View style={styles.content}>
                {image}
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    photo: {
        height:200,
        width:200,
    },
});

AppRegistry.registerComponent('MyUserPicReactNative', () => App);

