'use strict';

/* Массив из 8 объектов  */
var ObjectTitle = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var ObjectPriceMin = 1000;
var ObjectPriceMax = 1000000;

var ObjectType = [
  'flat',
  'house',
  'bungalo'
];

var ObjectRoomsMin = 1;
var ObjectRoomsMax = 5;

var ObjectCheckin = [
  '12:00',
  '13:00',
  '14:00'
];

var ObjectCheckout = [
  '12:00',
  '13:00',
  '14:00'
];

var ObjectFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var ObjectPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var LocationXMin = 300;
var LocationXMax = 900;
var LocationYMin = 150;
var LocationYMax = 500;

var ObjectMap = [];

var getRandomNumber = function (min, max) {
  return Math.floor((Math.random() * (max - min + 1) ) + min);
};

var getRandomItem = function (array) {
  var RandomItem = Math.floor(Math.random() * array.length);
  return array[RandomItem];
};

var getUniqueFeatures = function (array) {
  var UniqueFeatures = {};
  var ResultUniqueFeatures = [];

  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (UniqueFeatures[item] !== 1) {
      UniqueFeatures[item] = 1;
      ResultUniqueFeatures.push(item);
    }
  }
  return ResultUniqueFeatures;
};

var getRandomFeatures = function (array) {
  var RandomFeaturesLength = getRandomNumber(1, array.length);
  var RandomFeatures = [];

  for (var i = 0; i < RandomFeaturesLength; i++) {
    RandomFeatures.push(getRandomItem(array));
  }
  return getUniqueFeatures(RandomFeatures);
};

var getRandomPhoto = function (arr) {
  var arrCopy = arr.slice();
  var RandomPhoto = [];
  for (var j = 0; j < arrCopy.length; j++) {
    var RandomPhotoIndex = Math.floor(Math.random() * arrCopy.length);
    RandomPhoto.push(arrCopy[RandomPhotoIndex]);
    arrCopy.splice(RandomPhotoIndex, 1);
    j--;
  }
  return RandomPhoto;
};

var getObjectMap = function () {
  for (var i = 1; i <= 8; i++) {
    var LocationX = getRandomNumber(LocationXMin, LocationXMax);
    var LocationY = getRandomNumber(LocationYMin, LocationYMax);

    ObjectMap.push ( {
      author: {
        avatar: 'img/avatars/user' + '0' + i + '.png'
      },
      offer: {
        title: getRandomItem(ObjectTitle),
        address: LocationX + ', ' + LocationY,
        price: getRandomNumber(ObjectPriceMin, ObjectPriceMax),
        type: getRandomItem(ObjectType),
        rooms: getRandomNumber(ObjectRoomsMin, ObjectRoomsMax),
        guests: getRandomNumber(1, 5),
        checkin: getRandomItem(ObjectCheckin),
        checkout: getRandomItem(ObjectCheckout),
        features: getRandomFeatures(ObjectFeatures),
        description: '',
        photos: getRandomPhoto(ObjectPhotos)
      },
      location: {
        x: getRandomNumber(LocationXMin, LocationXMax),
        y: getRandomNumber(LocationYMin, LocationYMax)
      }
    });
  }
  return ObjectMap;
};

getObjectMap();

var Map = document.querySelector('.map');
Map.classList.remove('map--faded');

var MapPins = document.querySelector('.map__pins');

var TemplateMapPin = document.querySelector('template').content.querySelector('.map__pin');

var RenderMapPins = function (Pin) {
  var NewMapPins = TemplateMapPin.cloneNode(true);
  NewMapPins.querySelector('img').src = Pin.author.avatar;
  NewMapPins.style.left = (Pin.location.x) + 'px';
  NewMapPins.style.top = (Pin.location.y) + 'px';

  return NewMapPins;
};

var FragmentPins = document.createDocumentFragment();

for (var i = 0; i < ObjectMap.length; i++) {
  FragmentPins.appendChild(RenderMapPins(ObjectMap[i]));
}

MapPins.appendChild(FragmentPins);



var TemplateCardObject = document.querySelector('template').content.querySelector('.map__card');

var Type = {
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalow': 'Бунгало'
};

var RenderCardObject = function (obj) {

  var CardObject = TemplateCardObject.cloneNode(true);
  var CardObjectFeatures = CardObject.querySelector('.popup__features');
  var CardObjectType = CardObject.querySelector('h4');
  var CardObjectPhoto = CardObject.querySelector('.popup__pictures');
  var PhotoFragment = document.createDocumentFragment();
  var FeaturesFragment = document.createDocumentFragment();

  CardObject.querySelector('.popup__avatar').textContent = obj.author.avatar;
  CardObject.querySelector('h3').textContent = obj.offer.title;
  CardObject.querySelector('small').innerHTML = obj.offer.address;
  CardObject.querySelector('.popup__price').innerHTML = obj.offer.price + ' &#x20bd;/ночь';
  CardObject.querySelector('h4').textContent = obj.offer.type;
  CardObject.querySelector('.popup__features').innerHTML = '';
  CardObject.querySelector('.popup__pictures').innerHTML = '';
  CardObject.querySelector('.popup__features').nextElementSibling.textContent = obj.offer.description;

  CardObjectType.textContent = Type[obj.offer.type];

  CardObjectType.nextElementSibling.textContent = obj.offer.rooms = ' комнаты' + ' для ' + obj.offer.guests + ' гостей';
  CardObjectType.nextElementSibling.nextElementSibling.textContent = 'Заезд после ' + obj.offer.checkin + ' ,' + 'выезд до '
    + obj.offer.checkout;

  for (var k = 0; k < obj.offer.features.length; k++) {
    var li = document.createElement('li');
    li.className = 'feature  feature--' + obj.offer.features[k];
    FeaturesFragment.appendChild(li);
  }
  CardObjectFeatures.appendChild(FeaturesFragment);
  CardObjectFeatures.nextElementSibling.textContent = obj.offer.description;
  document.querySelector('.map').appendChild(CardObject);

  var PhotoMove = function () {
    for (var j = 0; j < obj.offer.photos.length; j++) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.width = 70;
      img.height = 70;
      li.appendChild(img);
      img.src = obj.offer.photos[j];
      PhotoFragment.appendChild(li);
    }
    CardObjectPhoto.appendChild(PhotoFragment);
  };
  PhotoMove();
};

RenderCardObject(ObjectMap[0]);
