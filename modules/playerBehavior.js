const playerProfiles = {
    daniel: {
        evaluateBid: [
            {weight: 3, value: 'strong fluffer'},
            {weight: 6, value: 'regular fluffer'},
            {weight: 5, value: 'weak fluffer'}
        ],
        makeBid: [
            {weight: 4, value: 'bluffer'},
            {weight: 7, value: 'regular bidder'},
            {weight: 5, value: 'strong bidder'}
        ]
    },
    matthew: {
        evaluateBid: [
            {weight: 3, value: 'strong fluffer'},
            {weight: 6, value: 'regular fluffer'},
            {weight: 5, value: 'weak fluffer'}
        ],
        makeBid: [
            {weight: 4, value: 'bluffer'},
            {weight: 7, value: 'regular bidder'},
            {weight: 5, value: 'strong bidder'}
        ]
    } , 
    evelyn: {
        evaluateBid: [
            {weight: 3, value: 'strong fluffer'},
            {weight: 6, value: 'regular fluffer'},
            {weight: 5, value: 'weak fluffer'}
        ],
        makeBid: [
            {weight: 4, value: 'bluffer'},
            {weight: 7, value: 'regular bidder'},
            {weight: 5, value: 'strong bidder'}
        ]
    },
    mama: {
        evaluateBid: [
            {weight: 3, value: 'strong fluffer'},
            {weight: 6, value: 'regular fluffer'},
            {weight: 5, value: 'weak fluffer'}
        ],
        makeBid: [
            {weight: 4, value: 'bluffer'},
            {weight: 7, value: 'regular bidder'},
            {weight: 5, value: 'strong bidder'}
        ]
    }
}

const valueTendencies = {
    evaluateBid: {
        'strong fluffer': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ],
        'regular fluffer': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ],
        'weak fluffer': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ]
    },
    makeBid: {
        'bluffer': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ],
        'regular bidder': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ],
        'strong bidder': [
            {weight: 2, value: function1()},
            {weight: 2, value: function1()},
            {weight: 2, value: function1()}
        ]
    }
}