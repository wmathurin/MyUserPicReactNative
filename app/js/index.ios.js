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
    TouchableHighlight,
    NavigatorIOS
} = React;
var forceClient = require('./react.force.net.js');
var ImagePickerManager = require('NativeModules').ImagePickerManager;

var pickPhoto = function(callback) {
    var options = {
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Take Photo...', 
        chooseFromLibraryButtonTitle: 'Choose from Library...', 
        cameraType: 'front', 
        mediaType: 'photo', 
        maxWidth: 200, 
        maxHeight: 200, 
        allowsEditing: true, 
        noData: true,
        storageOptions: { 
            skipBackup: true, 
            path: 'images' 
        }
    };

    ImagePickerManager.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.log('ImagePickerManager Error: ', response.error);
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            callback(response);
        }
    });
};

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
    getUserInfo: function(callback) {
        forceClient.sendRequest('/services/data', '/v36.0/chatter/users/me', 
                                function(response) {
                                    console.log(JSON.stringify(response));
                                    callback(response);
                                },
                                function(error) {
                                    console.log('Failed to get user info:' + error);
                                }, 
                                'GET', 
                                {}, 
                                {'X-Connect-Bearer-Urls': 'true'});

    },

    uploadPhoto: function(localPhotoUrl, callback) {
        forceClient.sendRequest('/services/data', '/v36.0/connect/user-profiles/' + this.state.userId + '/photo', 
                                function(response) {
                                    console.log(JSON.stringify(response));
                                    callback(response);
                                },
                                function(error) {
                                    console.log('Failed to upload user photo:' + error);
                                }, 
                                'POST', 
                                {}, 
                                {'X-Connect-Bearer-Urls': 'true'},
                                {fileUpload: {fileUrl:localPhotoUrl, fileMimeType:'image/jpeg', fileName:'pic.jpg'}}
                               );

    },

    componentDidMount: function() {
        var that = this;
        this.getUserInfo(function(userInfo) {
            that.setState({
                userId: userInfo.id,
                photoUrl: userInfo.photo.largePhotoUrl,
                photoVersionId: userInfo.photo.photoVersionId
            });
        });
    },

    onChangePic: function() {
        var that = this;
        pickPhoto(function(response) {
            that.uploadPhoto(response.uri, function(response) {
                that.setState({
                    photoUrl: response.largePhotoUrl,
                    photoVersionId: response.photoVersionId
                });
            });
        });
    },

    render: function() {
        var image = this.state
                     ? (<Image style={styles.photo} source={{uri: this.state.photoUrl}} />)
                     : (<Text>Loading</Text>);

        return (
            <View style={styles.content}>
                {image}
                <TouchableHighlight onPress={this.onChangePic}>
                  <Text>Change</Text>
                </TouchableHighlight>
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    photo: {
        height:200,
        width:200,
    },
});

AppRegistry.registerComponent('MyUserPicReactNative', () => App);

