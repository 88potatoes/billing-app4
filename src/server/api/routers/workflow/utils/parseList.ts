import * as cheerio from 'cheerio';

/**
 * Recursively parses an HTML list element (<ol> or <ul>) into a structured JSON array.
 * @param $list The Cheerio element representing the top-level list (<ol> or <ul>).
 * @param $ The Cheerio instance.
 * @returns A JSON array representing the nested list structure.
 */
export function parseList($list: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): any[] {
  const result: any[] = [];

  // Iterate over each direct child list item (li)
  $list.find('> li').each((index, li) => {
    const $li = $(li);
    const item: { name: string, children?: any[] } = { name: "" };

    // 1. Get the text of the list item, excluding any text inside nested lists
    //    We clone, remove children, and then get the text of the remainder.
    const nameText = $li.clone().children('ul, ol').remove().end().text().trim();
    item.name = nameText;

    // 2. Check for nested lists (<ul> or <ol>) as direct children of the <li>
    const $nestedList = $li.find('> ul, > ol').first();
    
    if ($nestedList.length > 0) {
      // 3. Recursively call the function for the nested list
      item.children = parseList($nestedList, $);
    }

    result.push(item);
  });

  return result;
}
