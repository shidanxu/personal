// Lead author: Donglai Wei

function y = U_cropim(im, label,ids,pad_w)
if ~exist('pad_w','var');pad_w=0;end
y=cell(1,numel(ids));
for i=1:numel(ids)
    ran  = U_getbb(label==ids(i));
    y{i} = im(max(1,ran(1)-pad_w):min(ran(2)+pad_w,size(im,1)),max(1,ran(3)-pad_w):min(ran(4)+pad_w,size(im,2)),:);
end
