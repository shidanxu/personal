// Lead author: Donglai Wei

function ran = U_getbb(im)
sz = size(im);
[yy,xx]=meshgrid(1:sz(2),1:sz(1));
ran = [min(xx(im==1)) max(xx(im==1)) min(yy(im==1)) max(yy(im==1))];
