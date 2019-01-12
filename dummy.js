
    var previousAnswersNumber;
    Query.find({
        _id: req.query.id
      })
      .then(doc => {
        console.log(doc[0]);
        previousAnswersNumber = doc[0].answerNumber+1;
      })
      .catch(err => {
        throw err;
      });
      console.log(previousAnswersNumber);
    Query.update({
      _id: req.query.id
    }, {
      $set: {
        answerNumber: previousAnswersNumber,
      }
    }, {
      upsert: true
    }, function (err) {
      throw err;
    });