import React from 'react';
import Bounce from 'bounce.js';

const Animation = {
    open: function (promise) {
        var n = this;
        new Bounce()
            .translate({
                from: {x: 450, y: 0},
                to: {x: 0, y: 0},
                easing: "bounce",
                duration: 1000,
                bounces: 4,
                stiffness: 3
            })
            .scale({
                from: {x: 1.2, y: 1},
                to: {x: 1, y: 1},
                easing: "bounce",
                duration: 1000,
                delay: 100,
                bounces: 4,
                stiffness: 1
            })
            .scale({
                from: {x: 1, y: 1.2},
                to: {x: 1, y: 1},
                easing: "bounce",
                duration: 1000,
                delay: 100,
                bounces: 6,
                stiffness: 1
            })
            .applyTo(n.barDom, {
                onComplete: function () {
                    promise(function (resolve) {
                        resolve();
                    })
                }
            });
    },
    close: function (promise) {
        var n = this;
        new Bounce()
            .translate({
                from: {x: 0, y: 0},
                to: {x: 450, y: 0},
                easing: "bounce",
                duration: 500,
                bounces: 4,
                stiffness: 1
            })
            .applyTo(n.barDom, {
                onComplete: function () {
                    promise(function (resolve) {
                        resolve();
                    })
                }
            });
    }
};

export default Animation;
