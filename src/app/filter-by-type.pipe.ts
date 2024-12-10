import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {
  transform(areas: any[], type: string, exclude = false): any[] {
    if (!areas) {
      return []; // Return empty if no areas provided
    }

    if (!type) {
      return areas; // If no type specified, return the full list
    }

    // If exclude is true, filter out the specified type
    return exclude
      ? areas.filter(area => area.type !== type)
      : areas.filter(area => area.type === type);
  }
}
