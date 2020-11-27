import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MatIconService {
  listIcons = [
    {
      name: 'logotype',
      src: 'assets/logotype.svg'
    },
    {
      name: 'check_circle',
      src: 'assets/icons/action/check_circle.svg'
    },
    {
      name: 'delete',
      src: 'assets/icons/action/delete.svg'
    },
    {
      name: 'get_app',
      src: 'assets/icons/action/get_app.svg'
    },
    {
      name: 'help_outline',
      src: 'assets/icons/action/help_outline.svg'
    },
    {
      name: 'highlight_off',
      src: 'assets/icons/action/highlight_off.svg'
    },
    {
      name: 'search',
      src: 'assets/icons/action/search.svg'
    },
    {
      name: 'visibility',
      src: 'assets/icons/action/visibility.svg'
    },
    {
      name: 'visibility_off',
      src: 'assets/icons/action/visibility_off.svg'
    },
    {
      name: 'error',
      src: 'assets/icons/alert/error.svg'
    },
    {
      name: 'error_outline',
      src: 'assets/icons/alert/error_outline.svg'
    },
    {
      name: 'add',
      src: 'assets/icons/content/add.svg'
    },
    {
      name: 'clear',
      src: 'assets/icons/content/clear.svg'
    },
    {
      name: 'content_copy',
      src: 'assets/icons/content/content_copy.svg'
    },
    {
      name: 'edit',
      src: 'assets/icons/content/edit.svg'
    },
    {
      name: 'filter_list',
      src: 'assets/icons/content/filter_list.svg'
    },
    {
      name: 'link',
      src: 'assets/icons/content/link.svg'
    },
    {
      name: 'file_download',
      src: 'assets/icons/file/file_download.svg'
    },
    {
      name: 'file_upload',
      src: 'assets/icons/file/file_upload.svg'
    },
    {
      name: 'keyboard_arrow_down',
      src: 'assets/icons/hardware/keyboard_arrow_down.svg'
    },
    {
      name: 'arrow_back',
      src: 'assets/icons/navigation/arrow_back.svg'
    },
    {
      name: 'fullscreen',
      src: 'assets/icons/navigation/fullscreen.svg'
    },
    {
      name: 'fullscreen_exit',
      src: 'assets/icons/navigation/fullscreen_exit.svg'
    },
    {
      name: 'menu',
      src: 'assets/icons/navigation/menu.svg'
    },
    {
      name: 'more_horiz',
      src: 'assets/icons/navigation/more_horiz.svg'
    },
    {
      name: 'group',
      src: 'assets/icons/social/group.svg'
    },
    {
      name: 'format_color_text',
      src: 'assets/icons/editor/format_color_text.svg'
    },
    {
      name: 'refresh',
      src: 'assets/icons/navigation/refresh.svg'
    },
    {
      name: 'reply',
      src: 'assets/icons/content/reply.svg'
    },
    {
      name: 'sort',
      src: 'assets/icons/filter/sort.svg'
    },
    {
      name: 'compare',
      src: 'assets/icons/compare.svg'
    }
  ];
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  init(): void {
    this.listIcons.forEach(({name, src}) =>
      this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(src)));
  }
}


