// Lead author: Donglai Wei


DIR_im  = '../../public/img/floorplan/';
Fnum=3;
im=imread([DIR_im 'fplan_' num2str(Fnum) '.png']);

do_step1=0;
do_step2=0;
do_step3=0;dis_step3=0;
do_step4=1;
cdist_thres=10;

if do_step1
% 1. binary character mask
c_thres=200;
char_map0 = min(im,[],3)>c_thres;
%imagesc(bsxfun(@times,a,uint8(min(a,[],3)>c_thres)))
[seg_map,num_seg] = bwlabel(char_map0);
seg_sz = histc(seg_map(:),1:num_seg);

sz_thres = [30 100];
char_map = ismember(seg_map,find(seg_sz>sz_thres(1) & seg_sz<sz_thres(2)));
%char_im = bsxfun(@times,im,uint8(char_map));
%imagesc(seg_map)
save([DIR_im sprintf('im_%d.mat',Fnum)],'char_map','seg_map')
else
load([DIR_im sprintf('im_%d.mat',Fnum)],'char_map','seg_map')

end

if do_step2
% 2. human label tplt
char_seg = [211 208 212 231 241 230 214];
char_y = [2:8];
tplt_im = U_cropim(char_map,seg_map,char_seg,1);
for i=1:numel(char_seg)
    imwrite(tplt_im{i},[DIR_im num2str(char_y(i)) '.png'])
end
save([DIR_im sprintf('num_%d.mat',Fnum)],'tplt_im','char_y')
else
load([DIR_im sprintf('num_%d.mat',Fnum)],'tplt_im','char_y')

end

if do_step3
% 3. ncc label tplt
sz = size(char_map);
%char_map2 = zeros(sz,'uint8');
if dis_step3
hAx  = axes;
imshow(char_im,'Parent', hAx);
end

%num=cell(size(tplt_im));
for i=1:numel(tplt_im)
    sz_t = size(tplt_im{i});
    res=normxcorr2(single(tplt_im{i}),single(char_map));
    [pos_x,pos_y]=ind2sub(size(res),find(res>0.8));
    %{
    for j=1:numel(pos_x)
        char_map2(pos_x(j)+(-sz_t(1):1),pos_y(j)+(-sz_t(2):1)) = char_y(i)*char_map(pos_x(j)+(-sz_t(1):1),pos_y(j)+(-sz_t(2):1));
    end
    %}
if dis_step3
    for j=1:numel(pos_x)
        imrect(hAx, [pos_y(j)-sz_t(2), pos_x(j)-sz_t(1), sz_t(2), sz_t(1)]);
    end
end
    num{i} = [pos_x'-floor(sz_t(1)/2);pos_y'-floor(sz_t(2)/2);ones(size(pos_x))'*char_y(i)];
end
    % find combo
    digit_thres = 1;
    num_a = U_num2id(cell2mat(num),digit_thres);
    %U_impt(char_map,num_a([2 1],:))
     %{
    [gid_map,gid_num]=bwlabel(imfilter(single(char_map2),ones(10)));
    gid_id=cell(2,gid_num);
    for j = 1:gid_num
        ran = U_getbb(gid_map==j);
        label_seq = char_map2(floor(mean(ran(1:2))),ran(3):ran(4));
        gid_id{1,j}=label_seq(label_seq(2:end)-label_seq(1:end-1)>0);
        tmp_l = char_map2.*gid_map==j;
        gid_id{2,j}=mean(reshape(ran,2,[]),1);
    end
    %}

save([DIR_im sprintf('label_%d.mat',Fnum)],'num_a')
else
load([DIR_im sprintf('label_%d.mat',Fnum)],'num_a')
end

if do_step4
    %{
    %manual hack
    out_name = 'map.csv';
    edge = [326 326 327 328 332 332 334 335; ... 
            327 332 328 332 334 336 335 336];
    dlmwrite(out_name,'type,name,x,y,dist','delimiter','')
    for i=1:size(num_a,2)
        dlmwrite(out_name,sprintf('%d,%d,%d,%d,0',0,num_a(3,i),floor(num_a(1,i)),floor(num_a(2,i))),'-append','delimiter','')
    end
    for i=1:size(edge,2)
        tmp_pos = num_a(1:2,ismember(num_a(3,:),edge(:,i)));
        dlmwrite(out_name,sprintf('%d,%d_%d,%d,%d,%d',1,edge(1,i),edge(2,i),0,0,floor(sum((tmp_pos(:,1)-tmp_pos(:,2)).^2))),'-append','delimiter','')
    end

    mat = [zeros(size(num_a,2),1);ones(size(edge,2),1)];

    dlmwrite('map.csv')
    %}
% gallery region
c_thres2= [84 149 211];
g_map0 = max(abs(bsxfun(@minus,double(im),reshape(c_thres2,[1 1 3]))),[],3)<cdist_thres;
% shut the door

cthres_wall= [198 199 201];
w_map0 = max(abs(bsxfun(@minus,double(im),reshape(cthres_wall,[1 1 3]))),[],3)<cdist_thres;
% horizontal line
[w_maph,w_mapv]=gradient(single(w_map0));
% find the box

end

