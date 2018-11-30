# XRPTipBot Queries

## Questions

1. Different collections for transaction type?
2. Different collection for users?


## MVP Queries 

### Homepage

**All-time**

1. **Total XRP Donated** 
    * Sum of XRP Across All Tips
    * Sum of XRP by Month over Last 6 Months

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { month: { $month: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: '$xrp' },
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.month": -1
    }
},
{ $limit: 6 }
])

```

2. **Total Tips** 
    * Sum of Tips
    * Sum of Tips by Month over Last 12 Months

```javascript
db.getCollection('transactions').count({type: "tip"});

db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { month: { $month: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: 1 },
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.month": -1
    }
}, 
{ $limit: 6 }

]);
```

{'$project': {
    '_id': true,
    'month': {month: {$month: '$moment' }},
    'year': {year: {$year: '$moment'}},
    'xrp': true,
    'count': 1
} },

3. **Total Number of Tippers**
    * Count of Distinct Users
    * Count of Distinct Users by Month over Last 12 Months

```javascript
_db.getCollection('transactions').distinct('user', {type: 'tip'}).length;_
```

#### Last Week

1. **Total XRP Donated** 

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { week: { $week: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: '$xrp' },
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.week": -1
    }
}, 
{ $limit: 7},
{$skip: 1}
]);
```

2. **Total Tips**

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { week: { $week: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: 1 },
      sum: {$sum: '$xrp'}
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.week": -1
    }
},
{ $limit: 7 },
{$skip: 1}

]);
```

3. Total Number of Tippers

```javascript
db.getCollection('transactions').distinct(
  'user', { type: 'tip', moment: { 
    $lte: ISODate("2018-05-01"), 
    $gte: ISODate("2018-03-01")}
    }).length;
```

**Leaderboard**

1. All-Time Most Tips

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              user: '$user',
          },
          count: {
              $sum: 1
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 1
  }

]);
```

2. All-Time Most Tips Received

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              to: '$to',
          },
          count: {
              $sum: 1
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 1
  }

]);

```

### Last Week Page

1. **Total XRP Donated**

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { week: { $week: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: '$xrp' },
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.week": -1
    }
},
{ $limit: 7},
{$skip: 1}
]);
```

2. **Total Tips** 
```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $group: {
      _id: { week: { $week: '$moment' }, year: { $year: '$moment' } },
      count: { $sum: 1 },
    }
  },
    { $sort: {
        "_id.year": -1,
        "_id.week": -1
    }
}, 
{ $limit: 7 },
{$skip: 1}

]);
```

3. Total Number of Tippers

```javascript
db.getCollection('transactions').distinct(
  'user', { type: 'tip', moment: { 
    $lte: ISODate("2018-05-01"), 
    $gte: ISODate("2018-03-01")}
    }).length;
```
4. Total Number of Recipients

```javascript
db.getCollection('transactions').distinct('to', { type: 'tip', moment: { $lte: ISODate("2018-05-01"), $gte: ISODate("2018-03-01")}}).length;
```

5. New Tippers (??)
```javascript
//Need to filter in memory
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  },
  {
    $sort: {
      moment: -1
    }
  },
  {
    $group: {
      _id: {
        user: '$user',
      },
      firstTip: {
        $first: "$moment"
      }
    }
  }
]);
```
6. New Recipients (??)
7. Most Tips Sent Leader
8. Most Tips Received Leader

### All-Time Page
1. Total XRP Donated 
2. Total Tips 
3. Total Number of Tippers
4. Total Number of Recipients
5. Avg. Weekly Tips
6. Avg. Weekly XRP
7. Most Tips Sent Leader
8. Most Tips Received Leader

### Leaderboard Page - All-Time

1. All-Time Most Tips

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              user: '$user',
          },
          count: {
              $sum: 1
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 10
  }

]);
```

2. All-Time Most Tips Received

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              to: '$to',
          },
          count: {
              $sum: 1
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 10
  }

]);

```

3. All-Time Most XRP Tipped

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              user: '$user',
          },
          count: {
              $sum: '$xrp'
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 10
  }

]);
```

4. All-Time Most XRP Received

```javascript
db.getCollection('transactions').aggregate([
  {
    $match: {
      "type": "tip",
    }
  }, 
  {
      $group: {
          _id: {
              to: '$to',
          },
          count: {
              $sum: '$xrp'
          }
      }
  },{
    $sort: {
      count: -1
    }
  }, {
  $limit: 10
  }

]);

```


### Leaderboard Page - Last Week
1. Most Tips
2. Most XRP
3. Most Tips Recieved
4. Most XRP Received

