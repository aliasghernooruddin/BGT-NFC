import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
        return items;
    }
    if ('name' in items[0]){
      return items.filter(item => item.name.indexOf(filter) !== -1);
    } else if ('first_name' in items[0].user){
      return items.filter(item => item.user.first_name.indexOf(filter) !== -1);
    }
    
    
}
}
