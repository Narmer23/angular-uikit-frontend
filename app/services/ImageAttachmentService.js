angular.module('services')
  .factory('ImageAttachmentService', ['Conf', function (Conf) {
    var imageAttachmentService = {};

    imageAttachmentService.getAttachmentPath = function (attachment, asThumbnail, percentRatio) {
      var ret = imageAttachmentService.getFallbackImage();
      if (attachment) {
        ret = Conf.basePath + '/attachments/' + attachment.id + '/content';
        if (asThumbnail) {
          ret += '/thumbnail';
          if (percentRatio) {
            ret += '?percentRatio=' + percentRatio
          }
        }
      }
      return ret;
    };

    imageAttachmentService.getFallbackImage = function () {
      return 'images/no-avatar.png';
    };


    return imageAttachmentService;
  }]);
