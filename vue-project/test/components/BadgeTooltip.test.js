import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import BadgeTooltip from '../../src/components/BadgeTooltip.vue';

function mount(props = {}, slotContent = 'Badge Label') {
    return render(BadgeTooltip, {
        props,
        slots: { default: slotContent },
    });
}

describe('BadgeTooltip — slot rendering', () => {
    it('renders slot content', () => {
        mount({ text: 'Info' }, 'New Arrival');
        expect(screen.getByText('New Arrival')).toBeTruthy();
    });

    it('still renders slot even when tooltip text is empty', () => {
        mount({ text: '' }, 'Just the badge');
        expect(screen.getByText('Just the badge')).toBeTruthy();
    });
});

describe('BadgeTooltip — tooltip visibility', () => {
    it('shows tooltip element when text prop is provided', () => {
        mount({ text: 'Tagged: new_arrival' });
        expect(screen.getByText('Tagged: new_arrival')).toBeTruthy();
    });

    it('hides tooltip element when text prop is empty string', () => {
        mount({ text: '' });
        expect(screen.queryByText(/Tagged|Auto/)).toBeNull();
    });

    it('hides tooltip element when text prop is not provided', () => {
        mount({});
        const tooltipContent = document.querySelector('.z-50');
        expect(tooltipContent).toBeNull();
    });

    it('tooltip has hover animation CSS classes', () => {
        mount({ text: 'Test tooltip' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip).not.toBeNull();
        expect(tooltip.className).toContain('opacity-0');
        expect(tooltip.className).toContain('group-hover/tooltip:opacity-100');
        expect(tooltip.className).toContain('transition-all');
        expect(tooltip.className).toContain('duration-200');
    });
});

describe('BadgeTooltip — side prop', () => {
    it('defaults side to top', () => {
        mount({ text: 'Default side' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip.className).toContain('bottom-full');
        expect(tooltip.className).toContain('mb-2');
    });

    it('applies correct position for side="bottom"', () => {
        mount({ text: 'Bottom tooltip', side: 'bottom' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip.className).toContain('top-full');
        expect(tooltip.className).toContain('mt-2');
        expect(tooltip.className).not.toContain('bottom-full');
    });

    it('applies correct position for side="left"', () => {
        mount({ text: 'Left tooltip', side: 'left' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip.className).toContain('right-full');
        expect(tooltip.className).toContain('mr-2');
        expect(tooltip.className).toContain('-translate-y-1/2');
    });

    it('applies correct position for side="right"', () => {
        mount({ text: 'Right tooltip', side: 'right' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip.className).toContain('left-full');
        expect(tooltip.className).toContain('ml-2');
        expect(tooltip.className).toContain('-translate-y-1/2');
    });

    it('reverts to top for unknown side values', () => {
        mount({ text: 'Unknown side', side: 'diagonal' });
        const tooltip = document.querySelector('.z-50');
        expect(tooltip.className).toContain('bottom-full');
        expect(tooltip.className).toContain('mb-2');
    });
});

describe('BadgeTooltip — arrow positioning', () => {
    it('arrow points down for top side (default)', () => {
        mount({ text: 'Arrow test', side: 'top' });
        const arrow = document.querySelectorAll('.bg-ink.rotate-45');
        expect(arrow.length).toBe(1);
        expect(arrow[0].className).toContain('top-full');
        expect(arrow[0].className).toContain('-mt-[1px]');
    });

    it('arrow points up for bottom side', () => {
        mount({ text: 'Arrow bottom', side: 'bottom' });
        const arrow = document.querySelectorAll('.bg-ink.rotate-45');
        expect(arrow.length).toBe(1);
        expect(arrow[0].className).toContain('bottom-full');
        expect(arrow[0].className).toContain('-mb-[1px]');
    });

    it('arrow points right for left side', () => {
        mount({ text: 'Arrow left', side: 'left' });
        const arrow = document.querySelectorAll('.bg-ink.rotate-45');
        expect(arrow.length).toBe(1);
        expect(arrow[0].className).toContain('left-full');
        expect(arrow[0].className).toContain('-ml-[1px]');
    });

    it('arrow points left for right side', () => {
        mount({ text: 'Arrow right', side: 'right' });
        const arrow = document.querySelectorAll('.bg-ink.rotate-45');
        expect(arrow.length).toBe(1);
        expect(arrow[0].className).toContain('right-full');
        expect(arrow[0].className).toContain('-mr-[1px]');
    });
});

describe('BadgeTooltip — root element', () => {
    it('has group/tooltip class for hover interaction', () => {
        mount({ text: 'Group test' });
        // The root div has group/tooltip class — search by a unique combination
        const allDivs = document.querySelectorAll('div');
        const root = Array.from(allDivs).find(d => d.className.includes('group/tooltip'));
        expect(root).not.toBeNull();
        expect(root.className).toContain('inline-flex');
    });

    it('forwards additional classes to the root element', () => {
        render(BadgeTooltip, {
            props: { text: 'Forward test' },
            slots: { default: 'Badge' },
            attrs: { class: 'absolute top-3 left-3 z-10' },
        });
        const allDivs = document.querySelectorAll('div');
        const root = Array.from(allDivs).find(d => d.className.includes('group/tooltip'));
        expect(root).not.toBeNull();
        expect(root.className).toContain('absolute');
        expect(root.className).toContain('top-3');
        expect(root.className).toContain('left-3');
    });
});
