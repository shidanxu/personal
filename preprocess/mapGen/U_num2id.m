// Lead author: Donglai Wei

function out = num2id(num,thres)
% 1-2 rows: pos
% 3 rows: id
pos=num(1:2,:);
label=num(3,:);
% hierachical cluster
T = cluster(linkage(pdist(pos','cityblock'),'average'),'cutoff',thres);
num_c = numel(unique(T));
out = zeros(3,num_c);

for i=1:num_c
    ind = find(T==i);
    [~,order] = sort(pos(2,ind),'ascend');
    out(3,i) = 10.^[numel(ind)-1:-1:0] *(label(ind(order))');
    out(1:2,i) = mean(pos(:,ind),2);
end
